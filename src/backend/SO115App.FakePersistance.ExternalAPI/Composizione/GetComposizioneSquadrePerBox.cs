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
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Squadra = SO115App.Models.Classi.ServiziEsterni.OPService.Squadra;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneSquadrePerBox : IGetComposizioneSquadrePerBox
    {
        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetSedi _getSedi;
        private readonly IGetPersonaFisica _getAnagrafiche;

        public GetComposizioneSquadrePerBox(IGetSquadre getSquadre,
            IGetStatoSquadra getStatoSquadre,
            IGetSedi getSedi,
            IGetPersonaFisica getAnagrafiche)
        {
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

            Task<List<MembroComposizione>> lstAnagrafiche = null;

            var lstSquadreComposizione = Task.Run(() => //GET
            {
                var lstSquadre = new ConcurrentBag<Squadra>();

                Parallel.ForEach(query.Filtro.CodiciDistaccamenti ?? lstSedi.Result.Select(sede => sede.Codice).Distinct(), codice =>
                {
                    var workshift = _getSquadre.GetAllByCodiceDistaccamento(codice.Split('.')[0]).Result;

                    switch (query.Filtro.Turno) //FILTRO PER TURNO
                    {
                        case TurnoRelativo.Precedente: Parallel.ForEach(workshift.Precedente.Squadre, squadra => lstSquadre.Add(squadra)); break;

                        case TurnoRelativo.Successivo: Parallel.ForEach(workshift.Successivo.Squadre, squadra => lstSquadre.Add(squadra)); break;

                        case null: Parallel.ForEach(workshift.Squadre, squadra => lstSquadre.Add(squadra)); break;
                    }
                });

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
                }));

                return lstSquadre;
            })
            .ContinueWith(lstSquadre => lstSquadre.Result.Where(squadra => //FILTRAGGIO
            {
                bool diEmergenza = squadra.DiEmergenza == query.Filtro?.DiEmergenza;

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    (query.Filtro.CodiciDistaccamenti?.Contains(squadra.Distaccamento?.Codice) ?? true) :
                    (query.Filtro.CodDistaccamentoSelezionato?.Equals(squadra.Distaccamento?.Codice) ?? true);

                bool ricerca = string.IsNullOrEmpty(query.Filtro.Ricerca) || squadra.Nome.Contains(query.Filtro.Ricerca);

                bool stato = query.Filtro.Stato != null ? squadra.Stato == query.Filtro?.Stato : true;

                return distaccamento && ricerca && diEmergenza && stato;
            }));

            var result = lstSquadreComposizione.Result.ToList();

            return result;
        }

        private static StatoSquadraComposizione MappaStato(string statoMezzo)
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
