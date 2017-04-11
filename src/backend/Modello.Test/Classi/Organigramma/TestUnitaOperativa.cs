//-----------------------------------------------------------------------
// <copyright file="TestUnitaOperativa.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Organigramma;
using NUnit.Framework;

namespace Modello.Test.Classi.Organigramma
{
    [TestFixture]
    public class TestUnitaOperativa
    {
        /// <summary>
        ///   <para>
        ///     Crea l'albero
        ///     +--  1
        ///     -----+-- 1.1
        ///     -----+-- 1.2
        ///     ---------+-- 1.2.1
        ///     ---------+-- 1.2.2
        ///     ---------+-- 1.2.3
        ///     -----+-- 1.3
        ///     ---------+-- 1.3.1
        ///     ---------+-- 1.3.2
        ///     -------------+--1.3.2.1
        ///     -------------+-- 1.3.2.2
        ///     ---------+-- 1.3.3
        ///   </para>
        ///   <para>Il test verifica che i nodi del sottoalbero 1.3 siano correttamente restituiti.</para>
        /// </summary>
        [SuppressMessage("StyleCop.CSharp.DocumentationRules", "SA1631:DocumentationMustMeetCharacterPercentage", Justification = "Reviewed.")]
        [Test]
        public void UnSottoalberoNonVuotoECorrettamenteRestituito()
        {
            var albero = new UnitaOperativa()
            {
                Codice = "1",
                Nome = "1",
            };

            var uo1_1 = new UnitaOperativa()
            {
                Codice = "1.1",
                Nome = "1.1",
            };
            albero.AddFiglio(uo1_1);

            var uo1_2 = new UnitaOperativa()
            {
                Codice = "1.2",
                Nome = "1.2",
            };
            albero.AddFiglio(uo1_2);

            var uo1_3 = new UnitaOperativa()
            {
                Codice = "1.3",
                Nome = "1.3",
            };
            albero.AddFiglio(uo1_3);

            var uo1_2_1 = new UnitaOperativa()
            {
                Codice = "1.2.1",
                Nome = "1.2.1",
            };
            uo1_2.AddFiglio(uo1_2_1);

            var uo1_2_2 = new UnitaOperativa()
            {
                Codice = "1.2.2",
                Nome = "1.2.2",
            };
            uo1_2.AddFiglio(uo1_2_2);

            var uo1_2_3 = new UnitaOperativa()
            {
                Codice = "1.2.3",
                Nome = "1.2.3",
            };
            uo1_2.AddFiglio(uo1_2_3);

            var uo1_3_1 = new UnitaOperativa()
            {
                Codice = "1.3.1",
                Nome = "1.3.1",
            };
            uo1_3.AddFiglio(uo1_3_1);

            var uo1_3_2 = new UnitaOperativa()
            {
                Codice = "1.3.2",
                Nome = "1.3.2",
            };
            uo1_3.AddFiglio(uo1_3_2);

            var uo1_3_3 = new UnitaOperativa()
            {
                Codice = "1.3.3",
                Nome = "1.3.3",
            };
            uo1_3.AddFiglio(uo1_3_3);

            var uo1_3_2_1 = new UnitaOperativa()
            {
                Codice = "1.3.2.1",
                Nome = "1.3.2.1",
            };
            uo1_3_2.AddFiglio(uo1_3_2_1);

            var uo1_3_2_2 = new UnitaOperativa()
            {
                Codice = "1.3.2.2",
                Nome = "1.3.2.2",
            };
            uo1_3_2.AddFiglio(uo1_3_2_2);

            var unitaOperativeSottoalbero = albero.Figli.Single(uo => uo.Codice == "1.3").GetSottoAlbero();

            Assert.That(unitaOperativeSottoalbero.Select(uo => uo.Codice), Is.EquivalentTo(new string[] { "1.3", "1.3.1", "1.3.2", "1.3.3", "1.3.2.1", "1.3.2.2" }));
        }

        [Test]
        public void UnSottoalberoVuotoECorrettamenteRestituito()
        {
            var albero = new UnitaOperativa()
            {
                Codice = "1",
                Nome = "1",
            };

            var unitaOperativeSottoalbero = albero.GetSottoAlbero();

            Assert.That(unitaOperativeSottoalbero.Count(), Is.EqualTo(unitaOperativeSottoalbero.Count()));
            Assert.That("1", Is.EqualTo(unitaOperativeSottoalbero.Single().Codice));
        }
    }
}
