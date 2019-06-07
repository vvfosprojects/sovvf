//-----------------------------------------------------------------------
// <copyright file="MarcaNonRilevante.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Evento che indica che la <see cref="RichiestaAssistenza" /> è marcata come non rilevante
    /// </summary>
    public class MarcaNonRilevante : Evento
    {
        /// <summary>
        ///   Costruttore dell'evento
        /// </summary>
        /// <param name="richiesta">La richiesta proprietaria dell'evento</param>
        /// <param name="istante">L'istante in cui avviene la marcatura</param>
        /// <param name="codiceFonte">La fonte da cui proviene l'informazione sulla non rilevanza</param>
        /// <param name="motivazione">La motivazione percui la richiesta è marcata come non rilevante</param>
        public MarcaNonRilevante(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string motivazione) : base(richiesta, istante, codiceFonte)
        {
            if (motivazione == null)
            {
                throw new ArgumentNullException(nameof(motivazione));
            }

            this.Motivazione = motivazione;
        }

        /// <summary>
        ///   La motivazione percui la <see cref="RichiestaAssistenza" /> è marcata come non rilevante
        /// </summary>
        public string Motivazione { get; private set; }
    }
}
