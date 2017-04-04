//-----------------------------------------------------------------------
// <copyright file="TestRichiestaAssistenza.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
// </copyright>
//-----------------------------------------------------------------------
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
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestRichiestaAssistenza
    {
        [Test]
        public void SeLaListaDiEventiEVuotaNonCiSonoChiamate()
        {
            var richiesta = new RichiestaAssistenza();

            var chiamate = richiesta.Telefonate;

            Assert.That(chiamate.Count, Is.Zero);
        }

        [Test]
        public void UnaSingolaChiamataECorrettamenteInserita()
        {
            var richiesta = new RichiestaAssistenza();
            var telefonata = new Telefonata();
            richiesta.Eventi.Add(telefonata);

            var telefonate = richiesta.Telefonate;

            Assert.That(telefonate.Count, Is.EqualTo(1));
        }
    }
}
