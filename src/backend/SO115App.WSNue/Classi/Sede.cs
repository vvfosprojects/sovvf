﻿//-----------------------------------------------------------------------
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

namespace SO115App.WSNue.Classi.NUE
{
    public class Sede
    {
        private bool VisualizzazioneCentrale = true;
        private string _descrizione;

        public Sede(string codice, string descrizione, string indirizzo, Coordinate coordinate, string tipoSede, string label, string icona, string regione, string provincia, bool visualizzazioneCentrale = true)
        {
            this.Codice = codice;
            this.Descrizione = descrizione;
            this.Indirizzo = indirizzo;
            this.Coordinate = coordinate;
            this.Tipo = tipoSede;
            this.Label = label;
            this.Icona = icona;
            this.Regione = regione;
            this.Provincia = provincia;
            this.VisualizzazioneCentrale = visualizzazioneCentrale;
        }

        /// <summary>
        ///   Codice Sede
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione Sede
        /// </summary>
        public string Descrizione
        {
            get
            {
                if (VisualizzazioneCentrale) return _descrizione
                    .Replace("Comando VV.F.", "Centrale")
                    .Replace("COMANDO VV.F.", "CENTRALE");
                else return _descrizione;
            }

            set => _descrizione = value;
        }

        /// <summary>
        ///   Coordinate
        /// </summary>
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   Indirizzo della Sede
        /// </summary>
        public string Indirizzo { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        public string Tipo { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        public string Regione { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
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
