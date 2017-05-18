//-----------------------------------------------------------------------
// <copyright file="Utente.cs" company="CNVVF">
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

namespace Modello.Classi.Autenticazione
{
    /// <summary>
    ///   Modella un utente del sistema.
    /// </summary>
    public class Utente
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="username">La username associata all'utente</param>
        /// <remarks>L'utenza viene create per default con il flag attivo impostato a true</remarks>
        public Utente(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(username));
            }

            this.Username = username;
            this.Attivo = true;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="username">La username associata all'utente</param>
        /// <param name="validoFinoA">La data di fine validità dell'utenza</param>
        /// <remarks>La data di inizio validità è il big bang</remarks>
        public Utente(string username, DateTime validoFinoA) : this(username)
        {
            if (validoFinoA == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException(nameof(validoFinoA));
            }

            this.ValidoFinoA = validoFinoA;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// ///
        /// <param name="username">La username associata all'utente</param>
        /// <param name="validoDa">La data di inizio validità dell'utenza</param>
        /// <param name="validoFinoA">La data di fine validità dell'utenza</param>
        public Utente(string username, DateTime validoDa, DateTime validoFinoA) : this(username, validoFinoA)
        {
            if (validoDa == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException(nameof(validoDa));
            }

            this.ValidoDa = validoDa;
        }

        /// <summary>
        ///   La username
        /// </summary>
        public string Username { get; private set; }

        /// <summary>
        ///   La data di inizio della validità dell'account. Se è null, la validità inizia dal big bang.
        /// </summary>
        public DateTime? ValidoDa { get; set; }

        /// <summary>
        ///   La data di fine della validità dell'account. Se è null, la validità ha durata indefinita.
        /// </summary>
        public DateTime? ValidoFinoA { get; set; }

        /// <summary>
        ///   Indica se l'account è attivo.
        /// </summary>
        public bool Attivo { get; set; }
    }
}
