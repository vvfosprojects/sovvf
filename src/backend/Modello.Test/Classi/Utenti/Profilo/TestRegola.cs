//-----------------------------------------------------------------------
// <copyright file="TestRegola.cs" company="CNVVF">
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
using Modello.Classi.Utenti.Profilo;
using NUnit.Framework;

namespace Modello.Test.Classi.Utenti.Profilo
{
    [TestFixture]
    public class TestRegola
    {
        [Test]
        public void La_regola_di_visibilita_puo_essere_creata_con_codice_e_username()
        {
            var visibilita = new VisibilitaPredefinitaSoccorso("UO1", "username");

            Assert.That(visibilita.CodiceUnitaOperativa, Is.EqualTo("UO1"));
            Assert.That(visibilita.Username, Is.EqualTo("username"));
            Assert.That(visibilita.ValidoDa, Is.Null);
            Assert.That(visibilita.ValidoFinoA, Is.Null);
            Assert.That(visibilita.Attiva, Is.True);
        }

        [Test]
        public void La_regola_di_visibilita_puo_essere_creata_con_codice_username_e_ricorsivita_true()
        {
            var visibilita = new VisibilitaPredefinitaSoccorso("UO1", true, "username");

            Assert.That(visibilita.CodiceUnitaOperativa, Is.EqualTo("UO1"));
            Assert.That(visibilita.Ricorsiva, Is.True);
            Assert.That(visibilita.Username, Is.EqualTo("username"));
            Assert.That(visibilita.ValidoDa, Is.Null);
            Assert.That(visibilita.ValidoFinoA, Is.Null);
            Assert.That(visibilita.Attiva, Is.True);
        }

        [Test]
        public void La_regola_di_visibilita_puo_essere_creata_con_codice_username_e_ricorsivita_false()
        {
            var visibilita = new VisibilitaPredefinitaSoccorso("UO1", false, "username");

            Assert.That(visibilita.CodiceUnitaOperativa, Is.EqualTo("UO1"));
            Assert.That(visibilita.Ricorsiva, Is.False);
            Assert.That(visibilita.Username, Is.EqualTo("username"));
            Assert.That(visibilita.ValidoDa, Is.Null);
            Assert.That(visibilita.ValidoFinoA, Is.Null);
            Assert.That(visibilita.Attiva, Is.True);
        }

        [Test]
        public void La_regola_di_visibilita_non_puo_essere_creata_con_codice_whitespace()
        {
            Assert.That(
                () =>
                {
                    new VisibilitaPredefinitaSoccorso(" ", "username");
                },
                Throws.ArgumentException);
        }

        [Test]
        public void La_regola_di_visibilita_non_puo_essere_creata_con_username_whitespace()
        {
            Assert.That(
                () =>
                {
                    new VisibilitaPredefinitaSoccorso("UO1", " ");
                },
                Throws.ArgumentException);
        }
    }
}
