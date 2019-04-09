//-----------------------------------------------------------------------
// <copyright file="DisponibilitaMezziQueryHandler.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes.ResultDTO;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class BoxMezziQueryHandler : IBoxMezziQueryHandler<BoxMezziQuery, BoxMezziResult>
    {
        public BoxMezziQueryHandler()
        {

        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public BoxMezziResult Handle(BoxMezziQuery query)
        {

            // preparazione del DTO
            var boxes = CaricaBox(query);

            return new BoxMezziResult()
            {
                BoxMezzi = boxes
            };

        }


        private static BoxMezzi CaricaBox(BoxMezziQuery query)
        {

            BoxMezzi mezzi = new BoxMezzi();

            //TODO PARTE CHIAMATA DB

             //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI           
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/BoxMezzi.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();              
            }

            mezzi = JsonConvert.DeserializeObject<BoxMezzi>(json);

            return mezzi;

        }

    }
}
