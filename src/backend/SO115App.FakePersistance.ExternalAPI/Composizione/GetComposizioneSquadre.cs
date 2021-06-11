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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetAnagraficaComponente _getAnagrafica;
        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;

        public GetComposizioneSquadre(IGetSquadre getSquadre, IGetStatoSquadra getStatoSquadre, IGetMezziUtilizzabili getMezzi, IGetAnagraficaComponente getAnagrafica,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti)
        {
            _getMezzi = getMezzi;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _getAnagrafica = getAnagrafica;

            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getDistaccamenti = getDistaccamenti;
        }

        public List<ComposizioneSquadra> Get(ComposizioneSquadreQuery query)
        {
            var lstDistaccamenti = Task.Run(() =>
            {
                var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
                var pinNodi = new List<PinNodo>();
                foreach (var sede in query.CodiciSede)
                    pinNodi.Add(new PinNodo(sede, true));

                foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
                    pinNodi.Add(new PinNodo(figlio.Codice, true));

                var result = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList());

                return result;
            });
            
            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(query.Filtro.CodiciDistaccamenti.ToList()));

            var lstSquadreComposizione = Task.Run(() => //GET
            {
                var lstSquadre = new ConcurrentBag<Squadra>();

                Parallel.ForEach(query.CodiciSede, codice =>
                {
                    var workshift = _getSquadre.GetAllByCodiceDistaccamento(codice.Split('.')[0]).Result;

                    switch (query.Filtro.Turno)
                    {
                        case TurnoRelativo.Attuale: lstSquadre.Union(workshift.Attuale); break;

                        case TurnoRelativo.Precedente: lstSquadre.Union(workshift.Precedente); break;

                        case TurnoRelativo.Successivo: lstSquadre.Union(workshift.Successivo); break;

                        case null: 
                            Parallel.ForEach(new List<Squadra[]>() { workshift.Attuale, workshift.Precedente, workshift.Successivo}.SelectMany(w => w), squadra => 
                                lstSquadre.Add(squadra)); break;
                    }
                });

                return lstSquadre;
            })
            .ContinueWith(squadre => //MAPPING
            {
                var lstSquadre = new ConcurrentBag<ComposizioneSquadra>();

                Parallel.ForEach(squadre.Result, squadra => lstSquadre.Add(new ComposizioneSquadra()
                {
                    Id = squadra.Id,
                    //Stato = lstStatiSquadre.Result.Find(statosquadra => statosquadra.IdSquadra.Equals(squadra.Codice))?.StatoSquadra ?? Costanti.MezzoInSede,
                    Codice = squadra.Codice,
                    Turno = squadra.TurnoAttuale.ToCharArray()[0],
                    Nome = squadra.Descrizione,
                    Distaccamento = lstDistaccamenti.Result.Find(d => d.Id.Contains(squadra.Distaccamento))?.Id, //TODO TOGLIERE NULLABLE
                    Membri = squadra.Membri.Select(m =>
                    {
                        var a = _getAnagrafica.GetByCodFiscale(m.CodiceFiscale);

                        return new MembroComposizione()
                        {
                            DescrizioneQualifica = m.Ruolo,
                            Nominativo = $"{a.Result?.Nome} {a.Result?.Cognome}",
                            CodiceFiscale = a.Result?.CodFiscale,
                        };
                    }).ToList(),
                    MezzoPreaccoppiato = squadra.CodiciMezziPreaccoppiati?.SelectMany(codice => _getMezzi.Get(query.CodiciSede.ToList(), null, codice).Result.Select(mezzo => new MezzoPreaccoppiato()
                    {
                        Codice = mezzo.Codice,
                        Stato = mezzo.Stato,
                        Genere = mezzo.Genere,
                        Descrizione = mezzo.Descrizione
                    })).FirstOrDefault() //TODO VERIFICARE SE SERVE ARRAY
                }));

                return lstSquadre;
            })
            .ContinueWith(lstSquadre => lstSquadre.Result.Where(squadra => //FILTRAGGIO
            {
                bool distaccamento = query.Filtro.CodiciDistaccamenti.Contains(squadra.Distaccamento);

                bool ricerca = string.IsNullOrEmpty(query.Filtro.Ricerca) ? true : squadra.Nome.Contains(query.Filtro.Ricerca);

                return distaccamento & ricerca;
            }))
            .ContinueWith(lstSquadre => //ORDINAMENTO
            {
                return lstSquadre.Result 
                    .OrderByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoInSede))
                    .ThenByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoInRientro))
                    .ThenByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoInViaggio))
                    .ThenByDescending(squadra => squadra.Stato.Equals(Costanti.MezzoSulPosto));
            });

            var result = lstSquadreComposizione.Result.ToList();

            return result;
        }
    }
}
