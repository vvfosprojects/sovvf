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
using Bogus;
using SO115App.GeneratoreRichiesteFake.StatoMezzo;
using System;
using System.Linq;

namespace SO115App.GeneratoreRichiesteFake
{
    /// <summary>
    ///   Il mezzo utilizzato per evadere una richiesta
    /// </summary>
    internal class Mezzo2
    {
        /// <summary>
        ///   Il generatore random utilizzato
        /// </summary>
        private static readonly Random RND = new Random();

        /// <summary>
        ///   Il generatore di valori fake
        /// </summary>
        private static Faker faker = null;

        /// <summary>
        ///   Il generatore di istanze fake del mezzo
        /// </summary>
        private static Faker<Mezzo2> fakerMezzo = null;

        /// <summary>
        ///   Il costruttore della classe
        /// </summary>
        public Mezzo2()
        {
            ContestoMezzo = new ContestoMezzo();
        }

        /// <summary>
        ///   Il codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Lo stato del mezzo (pattern state)
        /// </summary>
        public ContestoMezzo ContestoMezzo { get; }

        /// <summary>
        ///   I membri dell'equipaggio del mezzo
        /// </summary>
        public string[] Membri { get; set; }

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
        ///   Metodo per la creazione di un mezzo fake
        /// </summary>
        /// <param name="codiceUnitaOperativa">
        ///   L'unità operativa utilizzata nella generazione delle informazioni
        /// </param>
        /// <returns>Il mezzo fake creato</returns>
        public static Mezzo2 CreateMezzoFake(string codiceUnitaOperativa)
        {
            if (fakerMezzo == null)
            {
                fakerMezzo = new Faker<Mezzo2>()
                    .StrictMode(true)
                    .RuleFor(m => m.Codice, f => codiceUnitaOperativa + "/APS/" + f.Random.Number(10000, 99999))
                    .RuleFor(m => m.Membri, f => Enumerable.Range(1, 5).Select(n => GeneraCodiceFiscale()).ToArray());
                faker = new Faker();
            }

            return fakerMezzo.Generate();
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