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

namespace Modello.Classi.Condivise
{
    public class Tipologia
    {

        public Tipologia(string Codice, string Descrizione, string Icona)
        {
            this.codice = Codice;
            this.descrizione = Descrizione;
            this.icona = Icona;

        }

        /// <summary>
        ///   Codice della Tipologia
        /// </summary>
        public string codice { get; set; }

        /// <summary>
        ///   Descrizione Tipologia
        /// </summary>
        public string descrizione { get; set; }

        /// <summary>
        ///   Classe Icona Fontawsome corrispondente alla tipologia
        /// </summary>
        public string icona { get; set; }
    }
}
