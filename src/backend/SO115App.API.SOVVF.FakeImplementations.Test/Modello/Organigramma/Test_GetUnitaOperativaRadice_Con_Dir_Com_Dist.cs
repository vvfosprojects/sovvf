//-----------------------------------------------------------------------
// <copyright file="Test_GetUnitaOperativaRadice_Con_Dir_Com_Dist.cs" company="CNVVF">
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
using System.Linq;
using NUnit.Framework;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;

namespace Tests.Modello.Organigramma
{
    public class Test_GetUnitaOperativaRadice_Con_Dir_Com_Dist
    {
        [Test]
        public void IlComandoDiLeccoHaTreDistaccamenti()
        {
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var radice = organigramma.Get();
            var lecco = radice.GetSottoAlbero().Single(uo => uo.Codice == "LC");

            var numeroDistaccamentiLecco = lecco.GetSottoAlbero()
                .Where(uo => uo.Codice != "LC")
                .Count();

            Assert.That(numeroDistaccamentiLecco, Is.EqualTo(3));
        }

        [Test]
        public void TuttiIDistaccamentiDiLeccoHannoCodiceCheCominciaPerLCPunto()
        {
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();

            var radice = organigramma.Get();
            var lecco = radice.GetSottoAlbero().Single(uo => uo.Codice == "LC");
            var distaccamentiLecco = lecco.GetSottoAlbero()
                .Where(uo => uo.Codice != "LC");
            var listaCodici = distaccamentiLecco.Select(uo => uo.Codice);

            Assert.That(listaCodici, Is.All.StartsWith("LC."));
        }

        [Test]
        public void TuttiIDistaccamentiDiTorinoHannoCodiceCheCominciaPerTOPunto()
        {
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();

            var radice = organigramma.Get();
            var lecco = radice.GetSottoAlbero().Single(uo => uo.Codice == "TO");
            var distaccamentiLecco = lecco.GetSottoAlbero()
                .Where(uo => uo.Codice != "TO");
            var listaCodici = distaccamentiLecco.Select(uo => uo.Codice);

            Assert.That(listaCodici, Is.All.StartsWith("TO."));
        }

        [Test]
        public void IlComandoDiRomaHaIlDistaccamentoTuscolanoII()
        {
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var radice = organigramma.Get();
            var roma = radice.GetSottoAlbero().Single(uo => uo.Codice == "RM");

            Assert.DoesNotThrow(() => roma.GetSottoAlbero().Single(uo => uo.Codice == "RM.1008"));
        }
    }
}
