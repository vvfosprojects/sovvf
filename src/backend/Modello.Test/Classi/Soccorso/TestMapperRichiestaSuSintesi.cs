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
using Modello.Classi.Soccorso;
using Modello.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestMapperRichiestaSuSintesi
    {
        [Test]
        public void LIdRichiestaECorrettamenteMappato()
        {
            var richiesta = new RichiestaAssistenza()
            {
                Id = "TestId"
            };
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Id, Is.EqualTo(richiesta.Id));
        }

        [Test]
        public void IlCodiceRichiestaECorrettamenteMappato()
        {
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "TestCod"
            };
            var mapper = new MapperRichiestaSuSintesi();

            var sintesi = mapper.Map(richiesta);

            Assert.That(sintesi.Codice, Is.EqualTo(richiesta.Codice));
        }
    }
}
