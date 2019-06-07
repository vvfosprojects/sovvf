//-----------------------------------------------------------------------
// <copyright file="MezzoInSimulazione.cs" company="CNVVF">
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
using System.Linq;
using Bogus;
using SO115App.GeneratoreRichiesteFake.StatoMezzo;

namespace SO115App.GeneratoreRichiesteFake
{
    /// <summary>
    ///   Il mezzo utilizzato per evadere una richiesta
    /// </summary>
    internal class MezzoInSimulazione
    {
        /// <summary>
        ///   Il generatore random utilizzato
        /// </summary>
        private static readonly Random RND = new Random();

        /// <summary>
        ///   Il generatore di valori fake
        /// </summary>
        private static Faker faker = new Faker("it");

        /// <summary>
        ///   Il costruttore della classe
        /// </summary>
        public MezzoInSimulazione(API.Models.Classi.Soccorso.Mezzi.Mezzo mezzo)
        {
            this.ContestoMezzo = new ContestoMezzo();
            this.Membri = Enumerable.Range(0, 5).Select(i => GeneraCodiceFiscale()).ToArray();
            Mezzo = mezzo ?? throw new ArgumentNullException(nameof(mezzo));
        }

        /// <summary>
        ///   Il codice del mezzo
        /// </summary>
        public API.Models.Classi.Soccorso.Mezzi.Mezzo Mezzo { get; set; }

        /// <summary>
        ///   Lo stato del mezzo (pattern state)
        /// </summary>
        public ContestoMezzo ContestoMezzo { get; }

        /// <summary>
        ///   I membri dell'equipaggio del mezzo
        /// </summary>
        public string[] Membri { get; }

        /// <summary>
        ///   Indica se il mezzo è occupato
        /// </summary>
        public bool Occupato
        {
            get
            {
                return !this.ContestoMezzo.State.Disponibile;
            }
        }

        /// <summary>
        ///   Generazione di un codice fiscale italiano fake
        /// </summary>
        /// <returns>Il codice fiscale</returns>
        private static string GeneraCodiceFiscale()
        {
            return faker.Random.Replace("??????##?##?###?");
        }
    }
}
