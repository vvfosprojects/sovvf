//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesteAssistenzaQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using System.IO;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Marker;
using CQRS.Queries;

namespace SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiSediMarker
{
    /// <summary>
    ///   Query per l'accesso alla lista delle richieste di assistenza "di interesse". Quali sono le
    ///   richieste interessanti è specificato dal DTO di input. Ecco alcuni esempi di ricerca, in
    ///   base ai valori contenuti nel DTO di input:
    ///   <para>
    ///     - DTO vuoto: vengono selezionate le prime 10 richieste aperte più recenti, appartenenti
    ///       all'unità operativa a cui fa capo l'utente autenticato;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una lista di unità operative: vengono selezionate le prime 10 richieste
    ///       aperte più recenti, appartenenti alle unità operative indicate dal DTO;
    ///   </para>
    ///   <para>
    ///     - DTO contenente una stringa chiave: la ricerca restituisce le prime 10 richieste più
    ///       rilevanti rispetto al testo chiave (full-text search);
    ///   </para>
    ///   <para>
    ///     - DTO contenente un riferimento geo-referenziato: la ricerca restituisce le prime 10
    ///       richieste più vicine al riferimento;
    ///   </para>
    ///   <para>
    ///     - DTO contenente un array di stati richiesta: la ricerca restituisce le prime 10
    ///       richieste negli stati specificati.
    ///   </para>
    /// </summary>
    public class SintesiSediMarkerQueryHandler : IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult>
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly ICercaRichiesteAssistenza cercaRichiesteAssistenza;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="cercaRichiesteAssistenzaMarker">L'istanza del servizio</param>
        public SintesiSediMarkerQueryHandler(ICercaRichiesteAssistenza cercaRichiesteAssistenza)
        {
            this.cercaRichiesteAssistenza = cercaRichiesteAssistenza;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SintesiSediMarkerResult Handle(SintesiSediMarkerQuery query)
        {

           var sintesiSediMarker = new List<SintesiSedeMarker>();

            sintesiSediMarker = CercaMarkerSedi(query);

            return new SintesiSediMarkerResult()
            {
                SintesiSediMarker = sintesiSediMarker
            };
        }

        #region Interrogazione Fake da Session + Mapper della Richiesta sul Marker

        private static List<SintesiSedeMarker> CercaMarkerSedi(SintesiSediMarkerQuery query)
        {

            //TODO PARTE CHIAMATA DB
            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI           
            
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/fakeMarkerSede.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();              
            }

            List<SintesiSedeMarker> ListaSedi = JsonConvert.DeserializeObject<List<SintesiSedeMarker>>(json);

            return ListaSedi; 

        }
       
        #endregion
    }
}
