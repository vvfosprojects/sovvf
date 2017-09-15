//-----------------------------------------------------------------------
// <copyright file="TestMapperRichiestaSuSintesi.cs" company="CNVVF">
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
using Bogus;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using Moq;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestMapperRichiestaSuSintesi
    {
        [Test]
        public void LIdRichiestaECorrettamenteMappato()
        {
            var richiesta = this.GetMockRichiestaBenFormata().Object;
            richiesta.Id = "TestId";
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Id, Is.EqualTo(richiesta.Id));
        }

        [Test]
        public void IlCodiceRichiestaECorrettamenteMappato()
        {
            var richiesta = this.GetMockRichiestaBenFormata().Object;
            richiesta.Codice = "TestCod";
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Codice, Is.EqualTo(richiesta.Codice));
        }

        [Test]
        public void UnaRichiestaRilevanteHaLaRilevanzaCorrettamenteMappata()
        {
            var mockRichiesta = this.GetMockRichiestaBenFormata();
            mockRichiesta
                .Setup(r => r.Rilevante)
                .Returns(true);
            var richiesta = mockRichiesta.Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Rilevante, Is.True);
        }

        [Test]
        public void UnaRichiestaNonRilevanteHaLaRilevanzaCorrettamenteMappata()
        {
            var mockRichiesta = this.GetMockRichiestaBenFormata();
            mockRichiesta
                .Setup(r => r.Rilevante)
                .Returns(false);
            var richiesta = mockRichiesta.Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Rilevante, Is.False);
        }

        [Test]
        public void UnaRichiestaHaLIstanteRicezioneRichiestaCorrettamenteMappato()
        {
            var istanteRicezione = DateTime.Now.AddSeconds(-100);
            var richiesta = this.GetMockRichiestaBenFormata(istanteRicezione).Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.IstanteRicezioneRichiesta, Is.EqualTo(istanteRicezione));
        }

        [Test]
        public void UnaRichiestaHaLIstantePrimaAssegnazioneCorrettamenteMappato()
        {
            var istantePrimaAssegnazione = DateTime.Now.AddSeconds(10);
            var mockRichiesta = this.GetMockRichiestaBenFormata();
            mockRichiesta
                .Setup(r => r.IstantePrimaAssegnazione)
                .Returns(istantePrimaAssegnazione);
            var richiesta = mockRichiesta.Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.IstantePrimaAssegnazione, Is.EqualTo(istantePrimaAssegnazione));
        }

        [Test]
        public void PresidiatoECorrettamenteMappatoSeFalse()
        {
            var mockRichiesta = this.GetMockRichiestaBenFormata();
            mockRichiesta
                .Setup(r => r.Presidiato)
                .Returns(false);
            var richiesta = mockRichiesta.Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Presidiato, Is.False);
        }

        [Test]
        public void PresidiatoECorrettamenteMappatoSeTrue()
        {
            var mockRichiesta = this.GetMockRichiestaBenFormata();
            mockRichiesta
                .Setup(r => r.Presidiato)
                .Returns(true);
            var richiesta = mockRichiesta.Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Presidiato, Is.True);
        }

        [Test]
        [Repeat(20)]
        public void LaPrioritaECorrettamenteMappata()
        {
            var mockRichiesta = this.GetMockRichiestaBenFormata();
            var faker = new Faker();
            var priorita = faker.PickRandom<RichiestaAssistenza.Priorita>();
            mockRichiesta
                .Setup(r => r.PrioritaRichiesta)
                .Returns(priorita);
            var richiesta = mockRichiesta.Object;
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.PrioritaRichiesta, Is.EqualTo(priorita));
        }

        private Mock<RichiestaAssistenza> GetMockRichiestaBenFormata(DateTime? istanteRicezione = null)
        {
            if (!istanteRicezione.HasValue)
                istanteRicezione = DateTime.Now;

            var mockRichiesta = new Mock<RichiestaAssistenza>();
            mockRichiesta
                .Setup(r => r.IstanteRicezioneRichiesta)
                .Returns(istanteRicezione.Value);

            return mockRichiesta;
        }
    }
}
