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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
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

        public GetComposizioneSquadre(IGetSquadre getSquadre, 
            IGetStatoSquadra getStatoSquadre,
            IGetMezziUtilizzabili getMezzi,
            IGetStatoMezzi getStatoMezzi,
            IGetSedi getSedi,
            IGetPersonaFisica getAnagrafiche)
        {
            _getStatoMezzi = getStatoMezzi;
            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _getSedi = getSedi;
            _getAnagrafiche = getAnagrafiche;
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
                    Descrizione = s.sede,
                    Provincia = s.codProv
                }));

            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(query.Filtro.CodiciDistaccamenti?.ToList() ?? lstSedi.Result.Select(s => s.Codice).ToList()));
            var lstStatiMezzi = Task.Run(()=> _getStatoMezzi.Get(query.Filtro.CodiciDistaccamenti ?? lstSedi.Result.Select(s => s.Codice).ToArray()));

            Task<List<string>> lstMezziPreaccoppiati = null;
            Task<List<MembroComposizione>> lstAnagrafiche = null;

            var lstSquadreComposizione = Task.Run(() => //GET
            {
                var lstSquadre = new ConcurrentBag<Squadra>();

                Parallel.ForEach(query.Filtro.CodiciDistaccamenti ?? lstSedi.Result.Select(sede => sede.Codice).Distinct(), codice =>
                {
                    var workshift = _getSquadre.GetAllByCodiceDistaccamento(codice.Split('.')[0]).Result;

                    switch (query.Filtro.Turno) //FILTRO PER TURNO
                    {
                        case TurnoRelativo.Attuale: Parallel.ForEach(workshift.Attuale, squadra => lstSquadre.Add(squadra)); break;

                        case TurnoRelativo.Precedente: Parallel.ForEach(workshift.Precedente, squadra => lstSquadre.Add(squadra)); break;

                        case TurnoRelativo.Successivo: Parallel.ForEach(workshift.Successivo, squadra => lstSquadre.Add(squadra)); break;

                        case null: Parallel.ForEach(workshift.All, squadra => lstSquadre.Add(squadra)); break;
                    }
                });

                lstMezziPreaccoppiati = Task.Run(() => _getMezzi.GetInfo(lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null).SelectMany(s => s.CodiciMezziPreaccoppiati).ToList()).Result.Select(m => m.CodiceMezzo).ToList());
                lstAnagrafiche = Task.Run(() => _getAnagrafiche.Get(lstSquadre.SelectMany(s => s.Membri.Select(m => m.CodiceFiscale)).Distinct().ToList()).Result.Dati.Select(a => new MembroComposizione()
                {
                    Nominativo = $"{a?.Nome} {a?.Cognome}",
                    CodiceFiscale = a?.CodFiscale
                }).ToList());

                return lstSquadre;
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
                    MezziPreaccoppiati = lstMezziPreaccoppiati.Result.Select(m => new MezzoPreaccoppiato() { Codice = m }).ToList()
                }));

                return lstSquadre;
            })
            .ContinueWith(lstSquadre => lstSquadre.Result.Where(squadra => //FILTRAGGIO
            {
                bool diEmergenza = squadra.DiEmergenza == query.Filtro?.DiEmergenza;

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.DistaccamentoSquadra) ? 
                    (query.Filtro.CodiciDistaccamenti?.Contains(squadra.Distaccamento?.Codice) ?? true) :
                    (query.Filtro.DistaccamentoSquadra?.Equals(squadra.Distaccamento?.Codice) ?? true);

                bool ricerca = string.IsNullOrEmpty(query.Filtro.Ricerca) || squadra.Nome.Contains(query.Filtro.Ricerca);

                bool stato = squadra.Stato == query.Filtro?.Stato;

                return distaccamento && ricerca && diEmergenza && stato;
            }))
            .ContinueWith(lstSquadre => //ORDINAMENTO
            {
                return lstSquadre.Result 
                    .OrderBy(squadra => query.Filtro?.CodiciCompetenze?[0].Equals(squadra.Distaccamento.Codice) ?? false) 
                    .OrderBy(squadra => query.Filtro?.CodiciCompetenze?[1].Equals(squadra.Distaccamento?.Codice) ?? false) 
                    .OrderBy(squadra => query.Filtro?.CodiciCompetenze?[2].Equals(squadra.Distaccamento?.Codice) ?? false) 
                    .OrderByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoInSede))
                    .ThenByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoInRientro))
                    .ThenByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoInViaggio))
                    .ThenByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoSulPosto));
            });

            var result = lstSquadreComposizione.Result.ToList();

            return result;
        }

        private StatoSquadraComposizione MappaStato(string statoMezzo)
        {
            switch (statoMezzo)
            {
                case Costanti.MezzoInUscita: return StatoSquadraComposizione.InUscita;
                case Costanti.MezzoInViaggio: return StatoSquadraComposizione.InViaggio;
                case Costanti.MezzoSulPosto: return StatoSquadraComposizione.SulPosto;
                case Costanti.MezzoInRientro: return StatoSquadraComposizione.InRientro;
            }

            return StatoSquadraComposizione.InSede;
        }
    }
}