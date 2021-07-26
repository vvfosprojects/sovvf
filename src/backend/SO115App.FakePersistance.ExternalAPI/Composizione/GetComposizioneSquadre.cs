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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Squadra = SO115App.Models.Classi.ServiziEsterni.OPService.Squadra;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetStatoMezzi _getStatoMezzi;

        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetPersonaFisica _getAnagrafiche;

        private readonly IGetSedi _getSedi;

        private readonly Turno TurnoAttuale;
        private readonly Turno TurnoPrecedente;
        private readonly Turno TurnoSuccessivo;

        public GetComposizioneSquadre(IGetSquadre getSquadre,
            IGetStatoSquadra getStatoSquadre,
            IGetMezziUtilizzabili getMezzi,
            IGetStatoMezzi getStatoMezzi,
            IGetSedi getSedi,
            IGetPersonaFisica getAnagrafiche,
            IGetTurno getTurno)
        {
            _getStatoMezzi = getStatoMezzi;
            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _getSedi = getSedi;
            _getAnagrafiche = getAnagrafiche;

            TurnoAttuale = getTurno.Get();
            TurnoPrecedente = getTurno.Get(TurnoAttuale.DataOraInizio.AddMinutes(-1));
            TurnoSuccessivo = getTurno.Get(TurnoAttuale.DataOraFine.AddMinutes(1));
        }

        public List<ComposizioneSquadra> Get(ComposizioneSquadreQuery query)
        {
            var lstSedi = Task.Run(() => _getSedi.GetAll()
                .Where(s => s.attiva == 1 && s.codFiglio_TC >= 1000)
                .Distinct()
                .Select(s => new DistaccamentoComposizione()
                {
                    Codice = $"{s.codProv}.{s.codFiglio_TC}",
                    Coordinate = new Coordinate(s.latitudine, s.longitudine),
                    Descrizione = s.sede.Replace("Comando VV.F. di ", "Centrale ").Replace("Distaccamento Cittadino ", "").ToUpper(),
                    Provincia = s.codProv
                }));

            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(query.Filtro.CodiciDistaccamenti?.ToList() ?? lstSedi.Result.Select(s => s.Codice).ToList()));
            var lstStatiMezzi = Task.Run(() => _getStatoMezzi.Get(query.Filtro.CodiciDistaccamenti ?? lstSedi.Result.Select(s => s.Codice).ToArray()));

            Task<List<MezzoDTO>> lstMezziPreaccoppiati = null;
            Task<List<MembroComposizione>> lstAnagrafiche = null;

            var lstSquadreComposizione = Task.Run(() => //GET
            {
                var lstSquadre = new ConcurrentBag<Squadra>();
                Task<WorkShift> workshift = null;

                if (string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato))
                {
                    Parallel.ForEach(query.Filtro.CodiciDistaccamenti ?? lstSedi.Result.Select(sede => sede.Codice.Split('.')[0]).Distinct(),
                        codice => workshift = _getSquadre.GetAllByCodiceDistaccamento(codice));
                }
                else workshift = _getSquadre.GetAllByCodiceDistaccamento(query.Filtro.CodDistaccamentoSelezionato);

                switch (query.Filtro.Turno) //FILTRO PER TURNO
                {
                    case TurnoRelativo.Precedente: Parallel.ForEach(workshift.Result.Precedente, squadra => lstSquadre.Add(squadra)); break;

                    case TurnoRelativo.Successivo: Parallel.ForEach(workshift.Result.Successivo, squadra => lstSquadre.Add(squadra)); break;

                    case null: Parallel.ForEach(workshift.Result.Attuale, squadra => lstSquadre.Add(squadra)); break;
                }

                lstMezziPreaccoppiati = Task.Run(() => _getMezzi.GetInfo(lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null).SelectMany(s => s.CodiciMezziPreaccoppiati).ToList()));

                lstAnagrafiche = Task.Run(() => _getAnagrafiche.Get(lstSquadre.SelectMany(s => s.Membri.Select(m => m.CodiceFiscale)).Distinct().ToList()).Result.Dati.Select(a => new MembroComposizione()
                {
                    Nominativo = $"{a?.Nome} {a?.Cognome}",
                    CodiceFiscale = a?.CodFiscale
                }).ToList());

                return lstSquadre.ToList();
            })
            .ContinueWith(squadre => //MAPPING
            {
                var lstSquadre = new ConcurrentBag<ComposizioneSquadra>();

                Parallel.ForEach(squadre.Result, squadra => lstSquadre.Add(new ComposizioneSquadra()
                {
                    Stato = MappaStato(lstStatiSquadre.Result.Find(statosquadra => statosquadra.IdSquadra.Equals(squadra.Codice))?.StatoSquadra ?? Costanti.MezzoInSede),
                    Codice = squadra.Codice,
                    Turno = squadra.TurnoAttuale.ToCharArray()[0],
                    Nome = squadra.Descrizione,
                    DiEmergenza = squadra.Emergenza,
                    Distaccamento = lstSedi.Result.FirstOrDefault(d => d.Codice.Equals(squadra.Distaccamento)),
                    Membri = lstAnagrafiche.Result.FindAll(a => squadra.Membri.Select(m => m.CodiceFiscale).Contains(a.CodiceFiscale))?.Select(a => new MembroComposizione()
                    {
                        CodiceFiscale = a.CodiceFiscale,
                        Nominativo = a.Nominativo,
                        DescrizioneQualifica = squadra.Membri.FirstOrDefault(m => m.CodiceFiscale.Equals(a))?.Ruolo
                    }).ToList(),
                    MezziPreaccoppiati = squadra.CodiciMezziPreaccoppiati != null ? lstMezziPreaccoppiati.Result.FindAll(m => squadra.CodiciMezziPreaccoppiati.Contains(m.CodiceMezzo)).Select(m => new MezzoPreaccoppiato()
                    {
                        Codice = m.CodiceMezzo,
                        Descrizione = m.Descrizione,
                        Genere = m.Genere,
                        Distaccamento = m.DescrizioneAppartenenza,
                        Stato = lstStatiMezzi.Result.FirstOrDefault(mezzo => mezzo.CodiceMezzo.Equals(m.CodiceMezzo))?.StatoOperativo ?? Costanti.MezzoInSede
                    }).ToList() : null
                }));

                return lstSquadre;
            })
            .ContinueWith(lstSquadre => lstSquadre.Result.Where(squadra => //FILTRAGGIO
            {
                bool diEmergenza = squadra.DiEmergenza == query.Filtro?.DiEmergenza;

                bool turno = FiltroTurno(query.Filtro.Turno, squadra.Turno);

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    query.Filtro.CodiciDistaccamenti?.Contains(squadra.Distaccamento?.Codice) ?? true :
                    query.Filtro.CodDistaccamentoSelezionato.Equals(squadra.Distaccamento?.Codice);

                bool ricerca = string.IsNullOrEmpty(query.Filtro.Ricerca) || squadra.Nome.Contains(query.Filtro.Ricerca);

                bool stato = query.Filtro.Stato != null ? squadra.Stato == query.Filtro?.Stato : true;

                return distaccamento && ricerca && diEmergenza && stato /*&& turno*/;
            }))
            .ContinueWith(lstSquadre => //ORDINAMENTO
            {
                return lstSquadre.Result
                    .OrderBy(squadra => (!query?.Filtro?.CodSquadraSelezionata?.Equals(squadra.Codice)) ?? false)
                    .OrderBy(squadra => (!query?.Filtro?.CodDistaccamentoSelezionato?.Equals(squadra.Codice)) ?? false)
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoInSede))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoInRientro))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoInViaggio))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoSulPosto))
                    .OrderBy(squadra => Enum.GetName(typeof(StatoSquadraComposizione), squadra.Stato).Equals(Costanti.MezzoOccupato))
                    .ThenByDescending(squadra => query.Filtro.CodiciCompetenze?[0].Equals(squadra.Distaccamento?.Codice) ?? false)
                    .ThenByDescending(squadra => query.Filtro?.CodiciCompetenze?[1].Equals(squadra.Distaccamento?.Codice) ?? false)
                    .ThenByDescending(squadra => query.Filtro?.CodiciCompetenze?[2].Equals(squadra.Distaccamento?.Codice) ?? false)
                    .ThenBy(squadra => squadra.Nome);
            });

            var result = lstSquadreComposizione.Result.ToList();

            return result;
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
            TurnoRelativo.Precedente => TurnoPrecedente.Codice.Substring(0, 1).Equals(turnoSquadra),
            TurnoRelativo.Successivo => TurnoSuccessivo.Codice.Substring(0, 1).Equals(turnoSquadra),
            null => TurnoAttuale.Codice.Substring(0, 1).Equals(turnoSquadra),
            //TurnoRelativo.Attuale => TurnoAttuale.Codice.Substring(0, 1).Equals(turnoSquadra),
        };
    }
}
