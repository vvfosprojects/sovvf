//-----------------------------------------------------------------------
// <copyright file="GetMezziInServizioPerUnitaOperativa_Fake_Test.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using Moq;
using NUnit.Framework;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;

namespace SO115App.API.SOVVF.FakeImplementations.Test.Modello.GestioneSoccorso.Mezzi
{
    public class GetMezziInServizioPerUnitaOperativa_Fake_Test
    {
        private IEspandiPinNodoSuOrganigramma espandiPinNodoSuOrganigramma_mock;

        [SetUp]
        public void SetUp()
        {
            var mock = new Mock<IEspandiPinNodoSuOrganigramma>();
            mock.Setup(p => p.Espandi(It.IsAny<IEnumerable<PinNodo>>()))
                .Returns((IEnumerable<PinNodo> nodi) => { return nodi.Select(n => n.Codice); });
            espandiPinNodoSuOrganigramma_mock = mock.Object;
        }

        [Test]
        public void TraIMezziCheNonSonoDelComandCiEUnaEdUnaSolaAps()
        {
            var generatore = new GetMezziInServizioPerUnitaOperativa_Fake(this.espandiPinNodoSuOrganigramma_mock);

            const string codice = "RM.1001";
            var mezzi = generatore.Get(new[] { new PinNodo(codice, false) });

            var numeroAPS = mezzi.Count(m => m.Genere == "APS");

            Assert.That(numeroAPS, Is.EqualTo(1));
        }

        [Test]
        public void TraIMezziDelComandoCiEAlmenoUnaApsUnaEdUnaSolaAbEUnaEdUnaSolaAs()
        {
            var generatore = new GetMezziInServizioPerUnitaOperativa_Fake(this.espandiPinNodoSuOrganigramma_mock);

            const string codice = "RM.1000";
            var mezzi = generatore.Get(new[] { new PinNodo(codice, false) });

            var numeroAPS = mezzi.Count(m => m.Genere == "APS");
            var numeroAB = mezzi.Count(m => m.Genere == "AB");
            var numeroAS = mezzi.Count(m => m.Genere == "AS");

            Assert.Multiple(() =>
            {
                Assert.That(numeroAPS, Is.GreaterThanOrEqualTo(1));
                Assert.That(numeroAB, Is.EqualTo(1));
                Assert.That(numeroAS, Is.EqualTo(1));
            });
        }
    }
}
