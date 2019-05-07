//-----------------------------------------------------------------------
// <copyright file="SelezioneRisorsa.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Risorse
{
    /// <summary>
    ///   Questa classe rappresenta la selezione di una risorsa ad una <see cref="RichiestaAssistenza" />.
    /// </summary>
    /// <remarks>La risorsa selezionata non sarà selezionabile da altri operatori.</remarks>
    public class SelezioneRisorsa
    {
        /// <summary>
        ///   Costruttore vuoto
        /// </summary>
        public SelezioneRisorsa()
        {
        }

        /// <summary>
        ///   Crea un'istanza di SelezioneRisorsa, assegnando la selezione ad un operatore.
        /// </summary>
        /// <param name="operatore">L'operatore che esegue la selezione.</param>
        /// <remarks>La selezione risale temporalmente all'istante della creazione dell'istanza.</remarks>
        public SelezioneRisorsa(string operatore)
        {
            this.IstanteSelezione = DateTime.UtcNow;
            this.Operatore = operatore;
        }

        /// <summary>
        ///   Istante di selezione della risorsa.
        /// </summary>
        public DateTime IstanteSelezione { get; private set; }

        /// <summary>
        ///   Operatore che effettua la selezione.
        /// </summary>
        public string Operatore { get; private set; }
    }
}
