//-----------------------------------------------------------------------
// <copyright file="Sede.cs" company="CNVVF">
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
using System.ComponentModel.DataAnnotations;

namespace SO115App.API.Models.Classi.Condivise
{
    public class Sede
    {
        public Sede(string Codice, string Descrizione, string Indirizzo, Coordinate Coordinate, string TipoSede, string Label, string Icona, string Regione, string Provincia)
        {
            this.Codice = Codice;
            this.Descrizione = Descrizione;
            this.Indirizzo = Indirizzo;
            this.Coordinate = Coordinate;
            this.Tipo = TipoSede;
            this.Label = Label;
            this.Icona = Icona;
            this.Regione = Regione;
            this.Provincia = Provincia;
        }

        /// <summary>
        ///   Codice Sede
        /// </summary>
        [Required]
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione Sede
        /// </summary>
        [Required]
        public string Descrizione { get; set; }

        /// <summary>
        ///   Coordinate
        /// </summary>
        [Required]
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   Indirizzo della Sede
        /// </summary>
        [Required]
        public string Indirizzo { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        [Required]
        public string Tipo { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        [Required]
        public string Regione { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        [Required]
        public string Provincia { get; set; }

        /// <summary>
        ///   Label
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        ///   Icona
        /// </summary>
        public string Icona { get; set; }
    }
}
