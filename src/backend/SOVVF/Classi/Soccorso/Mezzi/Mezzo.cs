//-----------------------------------------------------------------------
// <copyright file="Mezzo.cs" company="CNVVF">
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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Mezzi
{
    /// <summary>
    ///   Modella un automezzo
    /// </summary>
    public class Mezzo
    {
        /// <summary>
        ///   Il costruttore
        /// </summary>
        /// <param name="codice">Il codice</param>
        /// <param name="descrizione">La descrizione</param>
        public Mezzo(string codice, string descrizione)
        {
            if (string.IsNullOrWhiteSpace(codice))
            {
                throw new ArgumentNullException(nameof(codice));
            }

            if (string.IsNullOrWhiteSpace(descrizione))
            {
                throw new ArgumentNullException(nameof(descrizione));
            }

            this.Codice = codice;
            this.Descrizione = descrizione;
        }

        /// <summary>
        ///   Il codice
        /// </summary>
        public string Codice { get; private set; }

        /// <summary>
        ///   La descrizione
        /// </summary>
        public string Descrizione { get; private set; }
    }
}
