//-----------------------------------------------------------------------
// <copyright file="TestMapperMezzoSuSintesi.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Mezzi;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using Moq;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestMapperMezzoSuSintesi
    {
        [Test]
        public void IlCodiceDiUnMezzoMappatoECorretto()
        {
            var mapperMezzoSuSintesi = GetMapperMezzoSuSintesi();

            var mezzo = mapperMezzoSuSintesi.Map("TestCodice", new Assegnato(DateTime.Now, "TestCodice"));

            Assert.That(mezzo.Codice, Is.EqualTo("TestCodice"));
        }

        [Test]
        [Repeat(20)]
        public void LoStatoDiUnMezzoMappatoECorretto()
        {
            var mapperMezzoSuSintesi = GetMapperMezzoSuSintesi();
            var faker = new Faker();
            var stato = faker.PickRandom<IStatoMezzo>(
                new InSede(DateTime.Now),
                new Assegnato(DateTime.Now, "TestCodice"),
                new InViaggio(DateTime.Now, "TestCodice"),
                new SulPosto(DateTime.Now, "TestCodice"),
                new InRientro(DateTime.Now, "TestCodice"));

            var mezzo = mapperMezzoSuSintesi.Map("TestCodice", stato);

            Assert.That(mezzo.StatoMezzo, Is.EqualTo(stato.Codice));
        }

        [Test]
        public void LaDescrizioneDelMezzoECorretta()
        {
            var mapperMezzoSuSintesi = GetMapperMezzoSuSintesi();

            var mezzo = mapperMezzoSuSintesi.Map("TestCodice", new InSede(DateTime.Now));

            Assert.That(mezzo.Descrizione, Is.EqualTo("DescrizioneMock"));
        }

        [Test]
        public void IlGenereDelMezzoECorretto()
        {
            var mapperMezzoSuSintesi = GetMapperMezzoSuSintesi();

            var mezzo = mapperMezzoSuSintesi.Map("TestCodice", new InSede(DateTime.Now));

            Assert.That(mezzo.Genere, Is.EqualTo("GenereMock"));
        }

        private static MapperMezzoSuSintesi GetMapperMezzoSuSintesi()
        {
            var mockGetMezzoByCodice = new Mock<IGetMezzoByCodice>();
            mockGetMezzoByCodice
                .Setup(mock => mock.Get(It.IsAny<string>()))
                .Returns<string>(codice => new Mezzo(codice, "DescrizioneMock", "GenereMock"));

            return new MapperMezzoSuSintesi(mockGetMezzoByCodice.Object);
        }
    }
}
