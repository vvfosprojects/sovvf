//-----------------------------------------------------------------------
// <copyright file="TipologiaLuogoEvento.cs" company="CNVVF">
// Copyright (C) 2019 - CNVVF
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
    public class TipologiaLuogoEvento
    {
        public TipologiaLuogoEvento(string Codice, string Descrizione)
        {
            this.Codice = Codice;
            this.Descrizione = Descrizione;
        }

        /// <summary>
        ///   Codice della TipologiaLuogoEvento
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione TipologiaLuogoEvento ( Es. Abitazione )
        /// </summary>
        public string Descrizione { get; set; }
    }
}
