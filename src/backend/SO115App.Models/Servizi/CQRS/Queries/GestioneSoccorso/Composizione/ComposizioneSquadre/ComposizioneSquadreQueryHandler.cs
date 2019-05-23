//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizioneSquadreQueryHandler : IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult>
    {
        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizioneSquadreResult Handle(ComposizioneSquadreQuery query)
        {
            var composizioneSquadre = new List<Classi.Composizione.ComposizioneSquadre>();
            // preparazione del DTO
            composizioneSquadre = CaricaComposizioneSquadre(query);

            return new ComposizioneSquadreResult()
            {
                ComposizioneSquadre = composizioneSquadre
            };
        }

        private static List<Classi.Composizione.ComposizioneSquadre> CaricaComposizioneSquadre(ComposizioneSquadreQuery query)
        {
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/SquadreComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            List<Classi.Composizione.ComposizioneMezzi> composizioneMezzi = new List<Classi.Composizione.ComposizioneMezzi>();
            Classi.Composizione.ComposizioneMezzi mezzo = new Classi.Composizione.ComposizioneMezzi();
            var codiceDistaccamento = "";
            List<Classi.Composizione.ComposizioneSquadre> composizioneSquadre = JsonConvert.DeserializeObject<List<Classi.Composizione.ComposizioneSquadre>>(json);
            if ((query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                || (query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0]))
                 || (query.Filtro.CodiceSquadra != null && query.Filtro.CodiceSquadra.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0])
                 || (query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                 || (query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
            {
                if ((query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0])))
                {
                    string path = "Fake/MezziComposizione.json";
                    string jsonMezzi;
                    using (StreamReader r = new StreamReader(path))
                    {
                        jsonMezzi = r.ReadToEnd();
                    }
                    composizioneMezzi = JsonConvert.DeserializeObject<List<Classi.Composizione.ComposizioneMezzi>>(jsonMezzi);
                    mezzo = composizioneMezzi.Where(x => (query.Filtro.CodiceMezzo.Any(x.Mezzo.Codice.Equals))).FirstOrDefault();
                    if(mezzo != null)
                    {
                        if (query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                        {
                            if (!query.Filtro.CodiceStatoMezzo.Any(mezzo.Mezzo.Stato.Equals))
                            {
                                mezzo = null;
                            }
                        }
                        if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                        {
                            if (!query.Filtro.CodiceDistaccamento.Any(mezzo.Mezzo.Distaccamento.Codice.Equals))
                            {
                                mezzo = null;
                            }
                        }
                        if (query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                        {
                            if (!query.Filtro.CodiceTipoMezzo.Any(mezzo.Mezzo.Genere.Equals))
                            {
                                mezzo = null;
                            }
                        }

                    }
                    if (mezzo != null)
                    {
                        codiceDistaccamento = mezzo.Mezzo.Distaccamento.Codice;
                        composizioneSquadre = composizioneSquadre.Where(x => x.Squadra.Distaccamento.Codice == codiceDistaccamento).ToList();
                    }
                }
                if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceDistaccamento.Any(x.Squadra.Distaccamento.Codice.Equals))).ToList();
                if (query.Filtro.CodiceSquadra != null && query.Filtro.CodiceSquadra.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceSquadra.Any(x.Squadra.Id.Equals))).ToList();
                return composizioneSquadre;
            }
            else
            {
                return composizioneSquadre;
            }
        }
    }
}