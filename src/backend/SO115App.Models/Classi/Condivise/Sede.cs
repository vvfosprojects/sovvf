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

using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SO115App.API.Models.Classi.Condivise
{
    [BsonIgnoreExtraElements]
    public class Sede
    {
        private bool VisualizzazioneCentrale = true;
        private string _descrizione;

        [JsonConstructor]
        public Sede(string desc) => Descrizione = desc;

        public Sede() { }

        public Sede(string codice, string descrizione, string indirizzo, Coordinate coordinate, bool visualizzazioneCentrale = true)
        {
            this.Codice = codice;
            this.Descrizione = descrizione;
            this.Indirizzo = indirizzo;
            this.Coordinate = coordinate;
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
    }
}
