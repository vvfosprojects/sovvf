//-----------------------------------------------------------------------
// <copyright file="SintesiMezzoMarker.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Marker
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiMezzoMarker
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SintesiMezzoMarker()
        {
        }

        /// <summary>
        ///   L'id della richiesta
        /// </summary>
        //public string id { get; set; }
        public Coordinate coordinate { get; set; }

        public Mezzo mezzo { get; set; }

        /// <summary>
        ///   Identifica il codice della Chiamata
        /// </summary>
        public string descrizioneAppartenenza { get; set; }

        /// <summary>
        ///   E' il codice della Richiesta di Assistenza
        /// </summary>
        public string descrizioneStato { get; set; }

        public int statoEfficienza { get; set; }

        public string descrizioneStatoEfficienza { get; set; }

        public int livelloCarburante { get; set; }

        public string descrizioneLivelloCarburante { get; set; }

        public int livelloEstinguente { get; set; }

        public string descrizioneLivelloEstinguente { get; set; }

        public string id_richiesta { get; set; }

        public Tipologia tipologie_richiesta { get; set; }

        public string label { get; set; }

        /// <summary>
        ///   Localita della richiesta
        /// </summary>
        //public Localita localita { get; set; }

        /// <summary>
        ///   Priorita della richiesta
        /// </summary>
        //public RichiestaAssistenza.Priorita priorita
        //{
        //    get; set;
        //}

        /// <summary>
        ///   Stato della richiesta
        /// </summary>
        //public string stato { get; set; }

        /// <summary>
        ///   Indica la data in cui è stato marcato RILEVANTE l'ultima volta
        /// </summary>
        /// <remarks>
        ///   Una richiesta può essere rilevante se è l'operatore a marcarla come tale, oppure in
        ///   base ad un insieme di regole automatiche deterministiche o basate su algoritmi di
        ///   machine learning.
        /// </remarks>
        //public DateTime? rilevanza { get; set; }

        /// <summary>
        ///   Opacità della richiesta, serve per opacizzare i Marker che non sono rilevanti ai fini della ricerca effettuata
        /// </summary>
        //public string opacita { get; set; }
    }
}