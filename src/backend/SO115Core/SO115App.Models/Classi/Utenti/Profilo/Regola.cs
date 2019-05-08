//-----------------------------------------------------------------------
// <copyright file="Regola.cs" company="CNVVF">
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
    ///   Modella una regola astratta del profilo utente
    /// </summary>
    public abstract class Regola
    {
        /// <summary>
        ///   Il costruttore della regola
        /// </summary>
        /// <param name="username">La username dell'utente al quale la regola si riferisce</param>
        public Regola(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(username));
            }

            this.Username = username;
            this.Attiva = true;
        }

        /// <summary>
        ///   La username dell'utente a cui la regola è riferita
        /// </summary>
        public string Username { get; private set; }

        /// <summary>
        ///   La data di inizio validità della regola. Se null la regola è valida dal big bang.
        /// </summary>
        public DateTime? ValidoDa { get; set; }

        /// <summary>
        ///   La data di fine validità della regola. Se null la regola è valida indefinitamente.
        /// </summary>
        public DateTime? ValidoFinoA { get; set; }

        /// <summary>
        ///   Indica se la regola è attiva o meno.
        /// </summary>
        public bool Attiva { get; set; }
    }
}