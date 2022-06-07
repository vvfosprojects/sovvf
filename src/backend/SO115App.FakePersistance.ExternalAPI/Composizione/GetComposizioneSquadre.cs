//-----------------------------------------------------------------------
// <copyright file="GetComposizioneSquadre.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Utenti;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SquadraOpService = SO115App.Models.Classi.ServiziEsterni.OPService.SquadraOpService;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetStatoMezzi _getStatoMezzi;

        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetSedi _getSedi;
        private readonly IGetSottoSediByCodSede _getSottoSedi;
        private readonly Turno TurnoAttuale;
        private readonly Turno TurnoPrecedente;
        private readonly Turno TurnoSuccessivo;

        private string codiceTurno;

        public GetComposizioneSquadre(IGetSquadre getSquadre,
            IGetStatoSquadra getStatoSquadre,
            IGetMezziUtilizzabili getMezzi,
            IGetStatoMezzi getStatoMezzi,
            IGetSedi getSedi,
            IGetTurno getTurno,
            IGetSottoSediByCodSede getSottoSedi)
        {
            _getStatoMezzi = getStatoMezzi;
            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _getSedi = getSedi;
            _getSottoSedi = getSottoSedi;
            TurnoAttuale = getTurno.Get();
            TurnoPrecedente = getTurno.Get(TurnoAttuale.DataOraInizio.AddMinutes(-1));
            TurnoSuccessivo = getTurno.Get(TurnoAttuale.DataOraFine.AddMinutes(1));
        }

        public List<ComposizioneSquadra> Get(ComposizioneSquadreQuery query)
        {
            #region GESTIONE CODICE SEDE

            var CodiciSede = new List<string> { };

            if (string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato))
            {
                if (query.Filtro.CodiciDistaccamenti != null && query.Filtro.CodiciDistaccamenti.Length > 0)
                {
                    CodiciSede = query.Filtro.CodiciDistaccamenti.ToList()/*.Select(sede => sede.Split('.')[0]).Distinct().ToArray()*/;
                }
                else
                {
                    CodiciSede = query.CodiciSede.ToList()/*[0].Split('.')[0]*/;
                }
            }
            else
            {
                CodiciSede.Add(query.Filtro.CodDistaccamentoSelezionato);
            }

            var filtroCodiciSede = CodiciSede.SelectMany(sede =>
            {
                if (sede.Contains('.'))
                    return new List<string> { sede.Split('.')[0] }; // distaccamento
                else
                    return _getSottoSedi.Get(new string[] { sede }).Select(s => s.Split('.')[0]); // con e direzione regionale
            }).Distinct().ToList();

            #endregion GESTIONE CODICE SEDE

            var lstSedi = _getSedi.GetAll().Result;

            switch (query.Filtro.Turno) //FILTRO PER TURNO
            {
                case TurnoRelativo.Precedente: codiceTurno = TurnoPrecedente.Codice.Substring(0, 1); break;
                case TurnoRelativo.Successivo: codiceTurno = TurnoSuccessivo.Codice.Substring(0, 1); break;
                case TurnoRelativo.Attuale: codiceTurno = TurnoAttuale.Codice.Substring(0, 1); break;
                case null: goto case TurnoRelativo.Attuale;
            }

            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(codiceTurno.Substring(0, 1), filtroCodiciSede).ToList()).Result;
            var lstStatiMezzi = Task.Run(() => _getStatoMezzi.Get(query.Filtro.CodiciDistaccamenti ?? filtroCodiciSede.ToArray())).Result;
            var lstMezziInRientro = Task.Run(() => _getMezzi.GetInfo(lstStatiMezzi.Where(stato => stato.StatoOperativo.Equals(Costanti.MezzoInRientro)).Select(s => s.CodiceMezzo).ToList()))?.Result;

            List<MezzoDTO> lstMezziPreaccoppiati = null;

            var lstSquadreComposizione = Task.Run(() => //GET
            {
                var result = new ConcurrentBag<SquadraOpService>();
                var workshift = new ConcurrentBag<WorkShift>();

                Parallel.ForEach(filtroCodiciSede,
                    codice => workshift.Add(_getSquadre.GetAllByCodiceDistaccamento(codice).Result));

                switch (query.Filtro.Turno) //FILTRO PER TURNO
                {
                    case TurnoRelativo.Precedente: Parallel.ForEach(workshift.Where(w => w != null).SelectMany(w => w.Precedente?.Squadre ?? default), squadra => result.Add(squadra)); break;
                    case TurnoRelativo.Successivo: Parallel.ForEach(workshift.Where(w => w != null).SelectMany(w => w.Successivo?.Squadre ?? default), squadra => result.Add(squadra)); break;
                    case TurnoRelativo.Attuale: Parallel.ForEach(workshift.Where(w => w != null).SelectMany(w => w?.Attuale?.Squadre ?? default), squadra => result.Add(squadra)); break;
                    case null: goto case TurnoRelativo.Attuale;
                }

                var codMezziPreaccoppiati = result.Where(s => s.CodiciMezziPreaccoppiati?.Any() ?? false).SelectMany(s => s.CodiciMezziPreaccoppiati).ToList();
                lstMezziPreaccoppiati = _getMezzi.GetInfo(codMezziPreaccoppiati)?.Result;

                return result.ToList().FindAll(s => s.spotType.Equals("WORKSHIFT"));
            })
            .ContinueWith(squadre => //MAPPING
            {
                var lstSquadre = new ConcurrentBag<ComposizioneSquadra>();

                Parallel.ForEach(squadre.Result, squadra =>
                {
                    var mezziInRientro = lstStatiSquadre != null ? lstMezziInRientro?.Where(m => lstStatiSquadre.FirstOrDefault(s => s.CodMezzo.Equals(m.CodiceMezzo))?.IdSquadra.Equals($"{squadra.Codice}_{codiceTurno}") ?? false).Select(m => new ComposizioneMezzi()
                    {
                        Id = m.CodiceMezzo,
                        Mezzo = new Mezzo()
                        {
                            Codice = m.CodiceMezzo,
                            Descrizione = m.Descrizione,
                            Distaccamento = new Sede(m.CodiceDistaccamento),
                            Genere = m.Genere,
                            Stato = Costanti.MezzoInRientro
                        }
                    }).ToList() ?? null : null;

                    var mezziPreaccoppiati = squadra.CodiciMezziPreaccoppiati?.Length > 0 ? lstMezziPreaccoppiati?.Where(m => squadra.CodiciMezziPreaccoppiati.Contains(m.CodiceMezzo)).Select(m => new ComposizioneMezzi()
                    {
                        Id = m.CodiceMezzo,
                        Mezzo = new Mezzo()
                        {
                            Appartenenza = m.CodiceDistaccamento,
                            Codice = m.CodiceMezzo,
                            Descrizione = m.Descrizione,
                            Genere = m.Genere,
                            Distaccamento = new Sede(m.DescrizioneAppartenenza),
                            Stato = lstStatiMezzi.FirstOrDefault(mezzo => mezzo.CodiceMezzo.Equals(m.CodiceMezzo))?.StatoOperativo ?? Costanti.MezzoInSede
                        }
                    }).ToList() : null;

                    lstSquadre.Add(new ComposizioneSquadra()
                    {
                        IdSquadra = squadra.spotId,
                        Stato = MappaStato(lstStatiSquadre.Find(statosquadra => statosquadra.IdSquadra.Equals($"{squadra.Codice}_{codiceTurno}"))?.StatoSquadra ?? Costanti.MezzoInSede),
                        Codice = squadra.Codice,
                        Turno = squadra.TurnoAttuale.ToCharArray()[0],
                        Nome = squadra.Descrizione,
                        DiEmergenza = squadra.Emergenza,
                        Distaccamento = lstSedi.FirstOrDefault(d => d.Codice.Equals(squadra.Distaccamento))?.MapDistaccamentoComposizione() ?? null,
                        Membri = MappaMembriOPInSO(squadra.Membri),
                        MezziPreaccoppiati = mezziPreaccoppiati,
                        MezziInRientro = mezziInRientro,
                        Tipologia = squadra.spotType
                    });
                });

                return lstSquadre;
            })
            .ContinueWith(lstSquadre => lstSquadre.Result.Where(squadra => //FILTRAGGIO
            {
                bool diEmergenza = squadra.DiEmergenza == query.Filtro?.DiEmergenza;

                bool turno = FiltroTurno(query.Filtro.Turno, squadra.Turno);

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    query.Filtro.CodiciDistaccamenti?.Contains(squadra.Distaccamento?.Codice) ?? true :
                    query.Filtro.CodDistaccamentoSelezionato.Equals(squadra.Distaccamento?.Codice);

                var statoMezzo = lstStatiMezzi.FirstOrDefault(m => m.CodiceMezzo.Equals(query.Filtro?.CodMezzoSelezionato));

                bool squadraInRientroSuMezzo = statoMezzo?.StatoOperativo?.Equals(Costanti.MezzoInRientro) ?? false
                    ? query.Filtro?.CodMezzoSelezionato == null || (lstStatiSquadre.FirstOrDefault(s => s.IdSquadra.Equals($"{squadra.Codice}_{codiceTurno}"))?.CodMezzo.Equals(query.Filtro?.CodMezzoSelezionato) ?? false)
                    : distaccamento;

                bool ricerca = string.IsNullOrEmpty(query.Filtro.Ricerca) ||
                    squadra.Nome.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    squadra.Codice.ToUpper().Contains(query.Filtro.Ricerca.ToUpper());

                bool stato = query.Filtro.Stato == null || squadra.Stato == query.Filtro?.Stato;

                return distaccamento && ricerca && diEmergenza && stato && turno && squadraInRientroSuMezzo;
            }))
            .ContinueWith(lstSquadre => //ORDINAMENTO
            {
                return lstSquadre.Result
                    .OrderBy(squadra => (!query?.Filtro?.CodSquadraSelezionata?.Equals(squadra.Codice)) ?? false)
                    .OrderBy(squadra => squadra.Distaccamento.Codice)
                    .OrderBy(squadra => (!query?.Filtro?.CodDistaccamentoSelezionato?.Equals(squadra.Codice)) ?? false)
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoInSede))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoInRientro))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoInViaggio))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoSulPosto))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoOccupato))
                    .ThenByDescending(squadra => query.Filtro.CodiciCompetenze?.Length > 1 ? query.Filtro?.CodiciCompetenze[0].Equals(squadra.Distaccamento?.Codice) : false)
                    .ThenByDescending(squadra => query.Filtro.CodiciCompetenze?.Length > 1 ? query.Filtro?.CodiciCompetenze[1].Equals(squadra.Distaccamento?.Codice) : false)
                    .ThenByDescending(squadra => query.Filtro.CodiciCompetenze?.Length > 2 ? query.Filtro?.CodiciCompetenze[2].Equals(squadra.Distaccamento?.Codice) : false);
            });

            var result = lstSquadreComposizione.Result.ToList();

            return result;
        }

        private static List<MembroComposizione> MappaMembriOPInSO(Membro[] membri)
        {
            var lstMembriComposizione = membri.Select(membro => new MembroComposizione
            {
                Nominativo = $"{membro.FirstName} {membro.LastName}",
                Qualifications = membro.qualifications,
                DescrizioneQualifica = membro.Ruolo
            }).ToList();

            return lstMembriComposizione;
        }

        private static StatoSquadraComposizione MappaStato(string statoMezzo) => statoMezzo switch
        {
            Costanti.MezzoInUscita => StatoSquadraComposizione.InUscita,
            Costanti.MezzoInViaggio => StatoSquadraComposizione.InViaggio,
            Costanti.MezzoSulPosto => StatoSquadraComposizione.SulPosto,
            Costanti.MezzoInRientro => StatoSquadraComposizione.InRientro,
            _ => StatoSquadraComposizione.InSede,
        };

        private bool FiltroTurno(TurnoRelativo? filtroTurno, char turnoSquadra) => filtroTurno switch
        {
            TurnoRelativo.Precedente => TurnoPrecedente.Codice.Substring(0, 1).Equals(turnoSquadra.ToString()),
            TurnoRelativo.Successivo => TurnoSuccessivo.Codice.Substring(0, 1).Equals(turnoSquadra.ToString()),
            null => TurnoAttuale.Codice.Substring(0, 1).Equals(turnoSquadra.ToString()),

            //IN DISUSO
            TurnoRelativo.Attuale => TurnoAttuale.Codice.Substring(0, 1).Equals(turnoSquadra.ToString()),
            _ => TurnoAttuale.Codice.Substring(0, 1).Equals(turnoSquadra.ToString()),
        };
    }
}
