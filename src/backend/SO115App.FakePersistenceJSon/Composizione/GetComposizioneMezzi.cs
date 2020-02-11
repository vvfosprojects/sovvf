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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Persistence.MongoDB.GestioneMezzi;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.Composizione
{
    /// <summary>
    ///   La classe recupera i mezzi utilizzabili dal Json e genera la composizione mezzi
    ///   ordinandoli secondo una funzione di adeguatezza del mezzo tenendo conto della tipologia dell'intervento
    /// </summary>
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly OrdinamentoMezzi _ordinamentoMezzi;

        public GetComposizioneMezzi(IGetStatoMezzi getMezziPrenotati, OrdinamentoMezzi ordinamentoMezzi)
        {
            _getMezziPrenotati = getMezziPrenotati;
            _ordinamentoMezzi = ordinamentoMezzi;
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var listaMezzi = new List<Mezzo>();

            var filepath = CostantiJson.Mezzo;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            listaMezzi = JsonConvert.DeserializeObject<List<Mezzo>>(json);

            var composizioneMezzi = GeneraListaComposizioneMezzi(listaMezzi);

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

                foreach (var composizione in composizioneMezzi)
                {
                    composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.IdRichiesta);
                    composizione.Id = composizione.Mezzo.Codice;

                    if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                    {
                        composizione.IstanteScadenzaSelezione = null;
                    }
                }

                var composizioneMezziPrenotati = GetComposizioneMezziPrenotati(composizioneMezzi, query.CodiceSede);

                return composizioneMezziPrenotati.OrderByDescending(x => x.IndiceOrdinamento).ToList();
            }
            else
            {
                foreach (var composizione in composizioneMezzi)
                {
                    composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.IdRichiesta);
                    composizione.Id = composizione.Mezzo.Codice;

                    if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                    {
                        composizione.IstanteScadenzaSelezione = null;
                    }
                }

                var composizioneMezziPrenotati = GetComposizioneMezziPrenotati(composizioneMezzi, query.CodiceSede);

                return composizioneMezziPrenotati.OrderByDescending(x => x.IndiceOrdinamento).ToList();
            }
        }

        private List<ComposizioneMezzi> GetComposizioneMezziPrenotati(List<ComposizioneMezzi> composizioneMezzi, string codiceSede)
        {
            var mezziPrenotati = _getMezziPrenotati.Get(codiceSede);
            foreach (var composizione in composizioneMezzi)
            {
                if (mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)) != null)
                    composizione.IstanteScadenzaSelezione = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).IstanteScadenzaSelezione;
            }
            return composizioneMezzi;
        }

        private List<ComposizioneMezzi> GeneraListaComposizioneMezzi(List<Mezzo> listaMezzi)
        {
            var listaComposizione = new List<ComposizioneMezzi>();

            Random random = new Random();

            foreach (var mezzo in listaMezzi)
            {
                string kmGen = random.Next(1, 60).ToString();
                double TempoPer = Convert.ToDouble(kmGen.Replace(".", ",")) / 1.75;

                var composizione = new ComposizioneMezzi()
                {
                    Mezzo = mezzo,
                    Km = kmGen,
                    TempoPercorrenza = Math.Round(TempoPer, 2).ToString(CultureInfo.InvariantCulture),
                };

                listaComposizione.Add(composizione);
            }

            return listaComposizione;
        }
    }
}
