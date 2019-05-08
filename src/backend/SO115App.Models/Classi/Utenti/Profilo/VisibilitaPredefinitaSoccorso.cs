//-----------------------------------------------------------------------
// <copyright file="VisibilitaPredefinitaSoccorso.cs" company="CNVVF">
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
namespace SO115App.API.Models.Classi.Utenti.Profilo
{
    /// <summary>
    ///   Regola che rende visibili per default ad un utente le informazioni sul soccorso (richieste,
    ///   risorse, ecc.) di un'unità operativa.
    /// </summary>
    public class VisibilitaPredefinitaSoccorso : RegolaSuUnitaOperativa
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceUnitaOperativa">
        ///   Il codice dell'unità operativa alla quale la regola si riferisce
        /// </param>
        /// <param name="username">La username dell'utente a cui la regola è riferita</param>
        public VisibilitaPredefinitaSoccorso(string codiceUnitaOperativa, string username) : base(codiceUnitaOperativa, username)
        {
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="codiceUnitaOperativa">
        ///   Il codice dell'unità operativa alla quale la regola si riferisce
        /// </param>
        /// <param name="ricorsiva">Indica se la regola si estende anche ai nodi figli</param>
        /// <param name="username">La username dell'utente a cui la regola è riferita</param>
        public VisibilitaPredefinitaSoccorso(string codiceUnitaOperativa, bool ricorsiva, string username) : base(codiceUnitaOperativa, ricorsiva, username)
        {
        }
    }
}