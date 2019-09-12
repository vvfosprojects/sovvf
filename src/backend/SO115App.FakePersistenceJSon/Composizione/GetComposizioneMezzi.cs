//-----------------------------------------------------------------------
// <copyright file="GetComposizioneMezzi.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.FakePersistence.JSon.Utility;
using System;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.API.Models.Classi.Marker;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            MapFromFlottaToMezziMarker mapper = new MapFromFlottaToMezziMarker();
            List<MezzoMarker> ListaMezzi = new List<MezzoMarker>();

            var filepath = CostantiJson.FlottaMezzi;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<MapperMezziFromGeoFleet> FlottaMezzi = JsonConvert.DeserializeObject<List<MapperMezziFromGeoFleet>>(json);
            ListaMezzi = mapper.MappaFlottaMezziSuMezziMarker(FlottaMezzi).Where(x => x.Mezzo.Distaccamento.Codice == query.CodiceSede).ToList();

            List<ComposizioneMezzi> composizioneMezzi = GeneraListaComposizioneMezzi(ListaMezzi);

            string[] generiMezzi;
            string[] statiMezzi;
            string codiceDistaccamento;
            if ((query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                || (query.Filtro.CodiceMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                || ((query.Filtro.CodiceSquadra?.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                || (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                || (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
            {
                if (query.Filtro.CodiceSquadra?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                {
                    var path = CostantiJson.SquadreComposizione;
                    string jsonSquadre;
                    using (var r = new StreamReader(path))
                    {
                        jsonSquadre = r.ReadToEnd();
                    }

                    var composizioneSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);
                    var squadra = composizioneSquadre.Find(x => query.Filtro.CodiceSquadra.Any(x.Squadra.Id.Equals));
                    if (squadra != null)
                    {
                        codiceDistaccamento = squadra.Squadra.Distaccamento.Codice;
                        composizioneMezzi = composizioneMezzi.Where(x => (x.Mezzo.Distaccamento.Codice == codiceDistaccamento)).ToList();
                    }
                }

                var pathFiltri = CostantiJson.Filtri;
                string jsonFiltri;
                using (var r = new StreamReader(pathFiltri))
                {
                    jsonFiltri = r.ReadToEnd();
                }
                var filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);

                if (query.Filtro.CodiceDistaccamento?.Length > 0
                    && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                {
                    composizioneMezzi = composizioneMezzi.Where(x => query.Filtro.CodiceDistaccamento.Any(x.Mezzo.Distaccamento.Codice.Equals)).ToList();
                }

                if (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                {
                    statiMezzi = filtri.Stati.Where(x => query.Filtro.CodiceStatoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                    composizioneMezzi = composizioneMezzi.Where(x => statiMezzi.Any(x.Mezzo.Stato.Equals)).ToList();
                }

                if (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                {
                    generiMezzi = filtri.GeneriMezzi.Where(x => query.Filtro.CodiceTipoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                    composizioneMezzi = composizioneMezzi.Where(x => generiMezzi.Any(x.Mezzo.Genere.Equals)).ToList();
                }

                if (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                    composizioneMezzi = composizioneMezzi.Where(x => x.Mezzo.Codice == query.Filtro.CodiceMezzo).ToList();

                var ordinamento = new OrdinamentoMezzi();
                foreach (var composizione in composizioneMezzi)
                {
                    composizione.IndiceOrdinamento = ordinamento.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.IdRichiesta);
                    composizione.IdRichiesta = composizione.Mezzo.IdRichiesta;
                    composizione.Id = composizione.Mezzo.Codice;

                    if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                    {
                        composizione.IstanteScadenzaSelezione = null;
                    }

                    if (composizione.Coordinate == null)
                    {
                        composizione.Coordinate = composizione.Mezzo.Distaccamento.Coordinate;
                    }
                }

                return composizioneMezzi.OrderByDescending(x => x.IndiceOrdinamento).ToList();
            }
            else
            {
                var ordinamento = new OrdinamentoMezzi();
                foreach (var composizione in composizioneMezzi)
                {
                    composizione.IndiceOrdinamento = ordinamento.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.IdRichiesta);
                    composizione.IdRichiesta = composizione.Mezzo.IdRichiesta;
                    composizione.Id = composizione.Mezzo.Codice;

                    if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                    {
                        composizione.IstanteScadenzaSelezione = null;
                    }

                    if (composizione.Coordinate == null)
                    {
                        composizione.Coordinate = composizione.Mezzo.Distaccamento.Coordinate;
                    }
                }

                return composizioneMezzi.OrderByDescending(x => x.IndiceOrdinamento).ToList();
            }
        }

        private List<ComposizioneMezzi> GeneraListaComposizioneMezzi(List<MezzoMarker> listaMezzi)
        {
            List<ComposizioneMezzi> ListaComposizione = new List<ComposizioneMezzi>();

            Random random = new Random();

            foreach (MezzoMarker mezzoMarker in listaMezzi)
            {
                string kmGen = random.Next(1, 60).ToString();
                double TempoPer = Convert.ToDouble(kmGen.Replace(".", ",")) / 1.75;

                ComposizioneMezzi composizione = new ComposizioneMezzi()
                {
                    Mezzo = mezzoMarker.Mezzo,
                    Km = kmGen,
                    TempoPercorrenza = Math.Round(TempoPer, 2).ToString(),
                    //IdRichiesta = mezzoMarker.IdRichiesta
                };

                ListaComposizione.Add(composizione);
            }

            return ListaComposizione;
        }
    }
}
