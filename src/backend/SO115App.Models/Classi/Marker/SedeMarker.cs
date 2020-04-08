//-----------------------------------------------------------------------
// <copyright file="SintesiSedeMarker.cs" company="CNVVF">
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
    public class SedeMarker
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SedeMarker()
        {
        }

        /// <summary>
        ///   L'id della richiesta
        /// </summary>
        //public string id { get; set; }

        /// <summary>
        ///   Identifica il codice della Chiamata
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   E' il codice della Richiesta di Assistenza
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Localita della richiesta
        /// </summary>
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   Tipologia della richiesta
        /// </summary>
        //public List<Tipologia> tipologia { get; set; }

        /// <summary>
        ///   Label della richiesta
        /// </summary>
        public string Indirizzo { get; set; }

        public string Tipo { get; set; }

        public string Regione { get; set; }

        public string Provincia { get; set; }
    }
}
