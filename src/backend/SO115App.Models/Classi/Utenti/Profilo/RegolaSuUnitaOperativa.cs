//-----------------------------------------------------------------------
// <copyright file="RegolaSuUnitaOperativa.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Utenti.Profilo
{
    /// <summary>
    ///   Regola astratta su un'unità operativa, che consente anche di indicarne la natura ricorsiva.
    /// </summary>
    public abstract class RegolaSuUnitaOperativa : Regola
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceUnitaOperativa">
        ///   Il codice dell'unità operativa alla quale la regola si riferisce
        /// </param>
        /// <param name="username">La username dell'utente a cui la regola è riferita</param>
        public RegolaSuUnitaOperativa(string codiceUnitaOperativa, string username) : base(username)
        {
            if (string.IsNullOrWhiteSpace(codiceUnitaOperativa))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(codiceUnitaOperativa));
            }

            this.CodiceUnitaOperativa = codiceUnitaOperativa;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceUnitaOperativa">
        ///   Il codice dell'unità operativa alla quale la regola si riferisce
        /// </param>
        /// <param name="ricorsiva">Indica se la regola si estende anche ai nodi figli</param>
        /// <param name="username">La username dell'utente a cui la regola è riferita</param>
        public RegolaSuUnitaOperativa(string codiceUnitaOperativa, bool ricorsiva, string username) : this(codiceUnitaOperativa, username)
        {
            this.Ricorsiva = ricorsiva;
        }

        /// <summary>
        ///   Il codice dell'unità operativa alla quale la regola si riferisce
        /// </summary>
        public string CodiceUnitaOperativa { get; private set; }

        /// <summary>
        ///   Indica se la regola vale anche sulle unità operative figlie di quella indicata da <see cref="CodiceUnitaOperativa" />
        /// </summary>
        public bool Ricorsiva { get; private set; }
    }
}
