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
            List<Classi.Composizione.ComposizioneSquadre> composizioneSquadreFiltrate = new List<Classi.Composizione.ComposizioneSquadre>();
            if (!string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento) || !string.IsNullOrEmpty(query.Filtro.CodiceMezzo)
                // || query.Filtro.CodiceSede != null
                || !string.IsNullOrEmpty(query.Filtro.CodiceSquadra) || !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo) || !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo))
            {
                if (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                {
                    string path = "Fake/MezziComposizione.json";
                    string jsonMezzi;
                    using (StreamReader r = new StreamReader(path))
                    {
                        jsonMezzi = r.ReadToEnd();
                    }
                    composizioneMezzi = JsonConvert.DeserializeObject<List<Classi.Composizione.ComposizioneMezzi>>(jsonMezzi);
                    mezzo = composizioneMezzi.Where(x => x.Mezzo.Codice == query.Filtro.CodiceMezzo).FirstOrDefault();
                    codiceDistaccamento = mezzo.Mezzo.Distaccamento.Codice;
                    composizioneSquadreFiltrate = composizioneSquadre.Where(x => x.Squadra.Distaccamento.Codice == codiceDistaccamento).ToList();
                    return composizioneSquadreFiltrate;
               }
                composizioneSquadreFiltrate= composizioneSquadre.Where(x => (!string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento) && x.Squadra.Distaccamento.Codice == query.Filtro.CodiceDistaccamento)).ToList();
                return composizioneSquadreFiltrate;
                //&& (query.Filtro.CodiceSede != null && x.Squadra.Distaccamento.Ccodice == query.Filtro.CodiceSede)).ToList();
            }
            else
            {
                return composizioneSquadre;
            }
        }
    }
}