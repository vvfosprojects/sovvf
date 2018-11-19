//-----------------------------------------------------------------------
// <copyright file="TestGeneratoreRichieste.cs" company="CNVVF">
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
using System.Linq;
using Modello.Classi.Soccorso.Eventi;
using NUnit.Framework;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste;

namespace SOVVF.FakeImplementations.Test
{
    [TestFixture]
    public class TestGeneratoreRichieste
    {
        [Test]
        [Ignore("Non è un test ma un metodo fake di generazione richieste")]
        public void GeneraRichieste()
        {
            var gi = new GeneratoreRichieste(
                "RM",
                5,
                DateTime.Now.AddHours(-12),
                DateTime.Now,
                25,
                30 * 60,
                15 * 60,
                45 * 60,
                15 * 60,
                new float[] { .85F, .7F, .4F, .3F, .1F });

            var richieste = gi.Genera()
                .OrderBy(r => (r.Eventi.First() as Evento).istante)
                .ToList();
        }
    }
}
