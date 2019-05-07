//-----------------------------------------------------------------------
// <copyright file="NonNecessario.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Condivise
{
    public class Sede
    {
        public Sede(string Codice, string Descrizione, string Indirizzo, Coordinate Coordinate, string TipoSede, string Label, string Icona, string Regione, string Provincia)
        {
            this.codice = Codice;
            this.descrizione = Descrizione;
            this.indirizzo = Indirizzo;
            this.coordinate = Coordinate;
            this.tipo = TipoSede;
            this.label = Label;
            this.icona = Icona;
            this.regione = Regione;
            this.provincia = Provincia;
        }

        /// <summary>
        /// Codice Sede
        /// </summary>
        public string codice { get; set; }

        /// <summary>
        /// Descrizione Sede
        /// </summary>
        public string descrizione { get; set; }

        /// <summary>
        /// Coordinate
        /// </summary>
        public Coordinate coordinate { get; set; }

        /// <summary>
        /// Indirizzo della Sede
        /// </summary>
        public string indirizzo { get; set; }

        /// <summary>
        /// Tipologia Sede
        /// </summary>
        public string tipo { get; set; }

        /// <summary>
        /// Tipologia Sede
        /// </summary>
        public string regione { get; set; }

        /// <summary>
        /// Tipologia Sede
        /// </summary>
        public string provincia { get; set; }

        /// <summary>
        /// Label
        /// </summary>
        public string label { get; set; }

        /// <summary>
        /// Icona
        /// </summary>
        public string icona { get; set; }
    }
}