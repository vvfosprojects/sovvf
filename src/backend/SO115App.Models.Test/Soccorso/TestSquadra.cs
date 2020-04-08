//-----------------------------------------------------------------------
// <copyright file="TestSquadra.cs" company="CNVVF">
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
using NUnit.Framework;
using SO115App.API.Models.Classi.Soccorso.Squadre;

namespace Modello.Test.Classi.Soccorso
{
    /// <summary>
    ///   Unit test relativa alla classe <see cref="DisponibilitaSquadra" />
    /// </summary>
    [TestFixture]
    public class TestSquadra
    {
        [Test]
        [Repeat(100)]
        public void UnaSquadraAppenaCreataHaUnTicketImpostato()
        {
            var s = new SoccorsoOrdinario();

            Assert.That(s.Ticket, Is.Not.Empty);
        }

        [Test]
        [Repeat(10)]
        public void UnaSquadraAppenaCreataHaUnTicketConformeAdUnGuid()
        {
            var s = new SoccorsoOrdinario();

            Guid guid;
            var correttamenteConvertito = Guid.TryParse(s.Ticket, out guid);

            Assert.That(correttamenteConvertito, Is.True);
        }

        [Test]
        [Repeat(10)]
        public void UnaSquadraAppenaCreataHaUnTicketCheNonEUnGuidVuoto()
        {
            var s = new SoccorsoOrdinario();

            Guid guid = Guid.Parse(s.Ticket);

            Assert.That(guid, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void UnaSquadraAppenaCreataHaUnaComposizionePartenzaNonNull()
        {
            var s = new SoccorsoOrdinario();

            Assert.That(s.ComposizionePrevista, Is.Not.Null);
        }

        [Test]
        public void UnaSquadraAppenaCreataHaUnaComposizioneDisponibileNonNull()
        {
            var s = new SoccorsoOrdinario();

            Assert.That(s.ComposizioneDisponibile, Is.Not.Null);
        }
    }
}
