//-----------------------------------------------------------------------
// <copyright file="RevocaPerAltraMotivazione.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Classe che modella una revoca per una motivazione non standard. La motivazione deve essere
    ///   specificata all'atto della costruzione della classe.
    /// </summary>
    public class RevocaPerAltraMotivazione : Revoca
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="richiesta">La richiesta a cui appartiene l'evento</param>
        /// <param name="codiceMezzo">Il codice mezzo relativo all'evento</param>
        /// <param name="istante">L'istante in cui l'evento si verifica</param>
        /// <param name="codiceFonte">La fonte informativa dell'evento</param>
        /// <param name="motivazione">La motivazione della revoca.</param>
        public RevocaPerAltraMotivazione(
            RichiestaAssistenza richiesta,
            string codiceMezzo,
            DateTime istante,
            string codiceFonte,
            string motivazione) : base(richiesta, codiceMezzo, istante, codiceFonte)
        {
            if (string.IsNullOrWhiteSpace(motivazione))
            {
                throw new ArgumentException("La motivazione della revoca deve essere specificata", nameof(motivazione));
            }

            this.Motivazione = motivazione;
        }

        /// <summary>
        ///   La motivazione della revoca
        /// </summary>
        public string Motivazione { get; private set; }
    }
}
