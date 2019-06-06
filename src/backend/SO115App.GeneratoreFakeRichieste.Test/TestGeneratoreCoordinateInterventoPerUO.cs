//-----------------------------------------------------------------------
// <copyright file="TestGeneratoreCoordinateInterventoPerUO.cs" company="CNVVF">
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
using NUnit.Framework;
using SO115App.GeneratoreRichiesteFake;

namespace Tests
{
    public class TestGeneratoreCoordinateInterventoPerUO
    {
        [Test]
        [Repeat(100)]
        public void GliInterventiDiTorinoSonoViciniATorino()
        {
            var generatore = new GeneratoreCoordinateInterventoPerUO();

            var coordinate = generatore.Genera("TO.1000");

            Assert.That(coordinate.Latitudine, Is.GreaterThan(44.08).And.LessThan(46.08));
            Assert.That(coordinate.Longitudine, Is.GreaterThan(6.62).And.LessThan(8.62));
        }

        [Test]
        [Repeat(100)]
        public void GliInterventiDiSiracusaSonoViciniASiracusa()
        {
            var generatore = new GeneratoreCoordinateInterventoPerUO();

            var coordinate = generatore.Genera("SR.1000");

            Assert.That(coordinate.Latitudine, Is.GreaterThan(36.08).And.LessThan(38.08));
            Assert.That(coordinate.Longitudine, Is.GreaterThan(14.18).And.LessThan(16.18));
        }
    }
}
