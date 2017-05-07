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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bogus;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste
{
    internal class Mezzo
    {
        private static Random rnd = new Random();
        private static Faker<Mezzo> fakerMezzo = null;
        private static Faker faker = null;

        public Mezzo()
        {
            ContestoMezzo = new ContestoMezzo();
        }

        public static Mezzo CreateMezzoFake(string codiceUnitaOperativa)
        {
            if (fakerMezzo == null)
            {
                fakerMezzo = new Faker<Mezzo>()
                    .StrictMode(true)
                    .RuleFor(m => m.Codice, f => codiceUnitaOperativa + "/APS/" + f.Random.Number(10000, 99999))
                    .RuleFor(m => m.Membri, f => Enumerable.Range(1, 5).Select(n => GeneraCodiceFiscale()).ToArray());
                faker = new Faker();
            }

            return fakerMezzo.Generate();
        }

        public string Codice { get; set; }
        public string[] Membri { get; set; }

        public bool Occupato
        {
            get
            {
                return !this.ContestoMezzo.State.Disponibile;
            }
        }

        public ContestoMezzo ContestoMezzo { get; }

        private static string GeneraCodiceFiscale()
        {
            return faker.Random.Replace("??????##?##?###?");
        }
    }
}
