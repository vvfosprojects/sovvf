//-----------------------------------------------------------------------
// <copyright file="ComposizioneMezziQueryHandler.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizioneMezziQueryHandler : IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult>
    {
        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizioneMezziResult Handle(ComposizioneMezziQuery query)
        {
            var composizioneMezzi = new List<Classi.Composizione.ComposizioneMezzi>();
            // preparazione del DTO
             composizioneMezzi = CaricaComposizioneMezzi(query);

            return new ComposizioneMezziResult()
            {
                ComposizioneMezzi = composizioneMezzi
            };
        }

        private static List<Classi.Composizione.ComposizioneMezzi> CaricaComposizioneMezzi(ComposizioneMezziQuery query)
        {
            List<Classi.Composizione.ComposizioneMezzi> composizioneMezzi = new List<Classi.Composizione.ComposizioneMezzi>();

            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            composizioneMezzi = JsonConvert.DeserializeObject<List<Classi.Composizione.ComposizioneMezzi>>(json);

            List<Classi.Composizione.ComposizioneSquadre> composizioneSquadre = new List<Classi.Composizione.ComposizioneSquadre>();
            var squadra = new Classi.Composizione.ComposizioneSquadre();
            var codiceDistaccamento = "";
            if (query.Filtro.CodiceDistaccamento != null || query.Filtro.CodiceMezzo != null 
               // || query.Filtro.CodiceSede != null
                || query.Filtro.CodiceSquadra != null ||
                query.Filtro.CodiceStatoMezzo != null || query.Filtro.CodiceTipoMezzo != null)
            {
                if (query.Filtro.CodiceSquadra != null)
                {
                    string path = "Fake/SquadreComposizione.json";
                    string jsonSquadre;
                    using (StreamReader r = new StreamReader(path))
                    {
                        jsonSquadre = r.ReadToEnd();
                    }

                    composizioneSquadre = JsonConvert.DeserializeObject<List<Classi.Composizione.ComposizioneSquadre>>(jsonSquadre);
                    squadra = composizioneSquadre.Where(x => x.Id == query.Filtro.CodiceSquadra).FirstOrDefault();
                    codiceDistaccamento = squadra.Squadra.Distaccamento.Ccodice;
                    return composizioneMezzi.Where(x => (x.Mezzo.Distaccamento.Ccodice == codiceDistaccamento) && (query.Filtro.CodiceDistaccamento != null && x.Mezzo.Distaccamento.Ccodice == query.Filtro.CodiceDistaccamento)
                && (query.Filtro.CodiceMezzo != null && x.Mezzo.Codice == query.Filtro.CodiceMezzo)
                && (query.Filtro.CodiceStatoMezzo != null && x.Mezzo.Stato == query.Filtro.CodiceStatoMezzo)
                && (query.Filtro.CodiceTipoMezzo != null && x.Mezzo.Genere == query.Filtro.CodiceTipoMezzo)).ToList();
                }
                return composizioneMezzi.Where(x => (query.Filtro.CodiceDistaccamento != null && x.Mezzo.Distaccamento.Ccodice == query.Filtro.CodiceDistaccamento)
                && (query.Filtro.CodiceMezzo != null && x.Mezzo.Codice == query.Filtro.CodiceMezzo)
                && (query.Filtro.CodiceStatoMezzo != null && x.Mezzo.Stato == query.Filtro.CodiceStatoMezzo)
                && (query.Filtro.CodiceTipoMezzo != null && x.Mezzo.Genere == query.Filtro.CodiceTipoMezzo)).ToList();
                //*&& (query.Filtro.CodiceSede != null && x.Mezzo.Distaccamento.Ccodice == query.Filtro.CodiceSede))*/.ToList();
            }
            else
            {
                return composizioneMezzi;
            }
        }
    }
}