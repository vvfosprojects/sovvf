//-----------------------------------------------------------------------
// <copyright file="MarcaRilevante.cs" company="CNVVF">
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
using Newtonsoft.Json;
using System;

namespace SO115App.API.Models.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Evento che indica che la <see cref="RichiestaAssistenza" /> è marcata come rilevante
    /// </summary>
    public class MarcaRilevante : Evento
    {
        /// <summary>
        ///   Costruttore dell'evento
        /// </summary>
        /// <param name="richiesta">La richiesta proprietaria dell'evento</param>
        /// <param name="istante">L'istante in cui avviene la marcatura</param>
        /// <param name="codiceFonte">La fonte da cui proviene l'informazione sulla rilevanza</param>
        /// <param name="motivazione">La motivazione percui la richiesta è marcata come rilevante</param>
        /// <param name="perGravita">Indica se la rilevanza è per gravità</param>
        /// <param name="perEdificioStArCu">Indica se la rilevanza è per edificio Storico/Artistico/Culturale</param>
        public MarcaRilevante(
            RichiestaAssistenza richiesta,
            DateTime istante,
            string codiceFonte,
            string motivazione,
            bool perGravita,
            bool perEdificioStArCu) : base(richiesta, istante, codiceFonte, "MarcaRilevante")
        {
            this.Motivazione = motivazione ?? throw new ArgumentNullException(nameof(motivazione));
            this.PerGravita = perGravita;
            this.PerEdificioStArCu = perEdificioStArCu;
        }

        [JsonConstructor]
        public MarcaRilevante(
            string codice,
            DateTime istante,
            string codiceFonte) : base(istante, codiceFonte, codice, "MarcaRilevante")
        {
        }

        /// <summary>
        ///   La motivazione percui la <see cref="RichiestaAssistenza" /> è marcata rilevante
        /// </summary>
        public string Motivazione { get; private set; }

        /// <summary>
        ///   Indica che la rilevanza è per gravità
        /// </summary>
        public bool PerGravita { get; private set; }

        /// <summary>
        ///   Indica che la rilevanza è per edificio Storico/Artistico/Culturale
        /// </summary>
        public bool PerEdificioStArCu { get; private set; }
    }
}
