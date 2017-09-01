//-----------------------------------------------------------------------
// <copyright file="TestComposizionePartenze.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Eccezioni;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Squadre;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    /// <summary>
    ///   Unit test relativa alla classe <see cref="ComposizionePartenze" />
    /// </summary>
    [TestFixture]
    public class TestComposizionePartenze
    {
        private ComposizionePartenze partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

        [SetUp]
        public void CreaComposizionePartenzaStandard()
        {
            var richiesta = new RichiestaAssistenza();
            this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista = new ComposizionePartenze(richiesta, DateTime.Now, "Fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX")
                    {
                        Ruoli = new HashSet<ComponentePartenza.Ruolo>() { ComponentePartenza.Ruolo.CapoPartenza }
                    },
                    new ComponentePartenza("YYY")
                    {
                        Ruoli = new HashSet<ComponentePartenza.Ruolo>() { ComponentePartenza.Ruolo.Autista }
                    },
                    new ComponentePartenza("ZZZ")
                    {
                        Ruoli = new HashSet<ComponentePartenza.Ruolo>() { ComponentePartenza.Ruolo.Vigile }
                    },
                    new ComponentePartenza("KKK")
                    {
                        Ruoli = new HashSet<ComponentePartenza.Ruolo>() { ComponentePartenza.Ruolo.Vigile }
                    },
                    new ComponentePartenza("LLL")
                    {
                        Ruoli = new HashSet<ComponentePartenza.Ruolo>() { ComponentePartenza.Ruolo.Vigile }
                    }
                }
            };
        }

        [Test]
        public void UnUnicoCapopartenzaECorrettamenteIndividuatoNellaListaDeiComponenti()
        {
            // Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

            // Act
            var codiceFiscaleCapopartenza = cp.CodiceFiscaleCapopartenza;

            // Assert
            Assert.That(codiceFiscaleCapopartenza, Is.EqualTo("XXX"));
        }

        [Test]
        public void ICodiciFiscaliDeiComponentiSonoCorrettamenteRestituiti()
        {
            // Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

            // Act
            var codiciFiscaliComponenti = cp.CodiciFiscaliComponenti;

            // Assert
            CollectionAssert.AreEquivalent(codiciFiscaliComponenti, new string[] { "ZZZ", "KKK", "XXX", "YYY", "LLL" });
        }

        [Test]
        public void ICodiciFiscaliDeiComponentiSonoCorrettamenteRestituitiSeNonCiSonoComponenti()
        {
            // Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;
            cp.Componenti.Clear();

            // Act
            var codiciFiscaliComponenti = cp.CodiciFiscaliComponenti;

            // Assert
            CollectionAssert.IsEmpty(codiciFiscaliComponenti);
        }

        [Test]
        public void IlNumeroDeiComponentiECorrettamenteRestituito()
        {
            // Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

            // Act
            var numeroComponenti = cp.NumeroComponenti;

            // Assert
            Assert.That(numeroComponenti, Is.EqualTo(5));
        }

        [Test]
        public void AccessoAlCodiceFiscalePartenzaSollevaEccezioneSeEPiuDiUno()
        {
            // Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;
            cp.Componenti.Add(
                    new ComponentePartenza("ZZY")
                    {
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.CapoPartenza }
                    });

            // Act & Assert
            Assert.That(
                () => cp.CodiceFiscaleCapopartenza,
                Throws.Exception.TypeOf<ComposizionePartenzaException>());
        }

        [Test]
        public void UnaComposizionePartenzaAppenaCreataHaLAttributoComponentiNonNull()
        {
            var richiesta = new RichiestaAssistenza();
            var cp = new ComposizionePartenze(richiesta, DateTime.Now, "Fonte", false);

            var componenti = cp.Componenti;

            Assert.That(componenti, Is.Not.Null);
        }
    }
}
