// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Eccezioni;
using NUnit.Framework;
using System.Collections.Generic;

namespace Modello.Test.Classi.Soccorso
{
    /// <summary>
    ///   Unit test relativa alla classe <see cref="TestComposizionePartenza" />
    /// </summary>
    [TestFixture]
    public class TestComposizionePartenza
    {
        private ComposizionePartenza partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

        [SetUp]
        public void CreaComposizionePartenzaStandard()
        {
            this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista = new ComposizionePartenza()
            {
                Componenti = new HashSet<Componente>()
                {
                    new Componente()
                    {
                        CodiceFiscale = "XXX",
                        CodiceMezzo = "M1",
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.CapoPartenza }
                    },
                    new Componente()
                    {
                        CodiceFiscale = "YYY",
                        CodiceMezzo = "M2",
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.Autista }
                    },
                    new Componente()
                    {
                        CodiceFiscale = "ZZZ",
                        CodiceMezzo = "M1",
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.Vigile }
                    },
                    new Componente()
                    {
                        CodiceFiscale = "KKK",
                        CodiceMezzo = "M1",
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.Vigile }
                    },
                    new Componente()
                    {
                        CodiceFiscale = "LLL",
                        CodiceMezzo = "M1",
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.Vigile }
                    }
                }
            };
        }

        [Test]
        public void UnUnicoCapopartenzaECorrettamenteIndividuatoNellaListaDeiComponenti()
        {
            //Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

            //Act
            var codiceFiscaleCapopartenza = cp.CodiceFiscaleCapopartenza;

            //Assert
            Assert.That(codiceFiscaleCapopartenza, Is.EqualTo("XXX"));
        }

        [Test]
        public void ICodiciFiscaliDeiComponentiSonoCorrettamenteRestituiti()
        {
            //Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

            //Act
            var codiciFiscaliComponenti = cp.CodiciFiscaliComponenti;

            //Assert
            CollectionAssert.AreEquivalent(codiciFiscaliComponenti, new string[] { "ZZZ", "KKK", "XXX", "YYY", "LLL" });
        }

        [Test]
        public void ICodiciFiscaliDeiComponentiSonoCorrettamenteRestituitiSeNonCiSonoComponenti()
        {
            //Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;
            cp.Componenti.Clear();

            //Act
            var codiciFiscaliComponenti = cp.CodiciFiscaliComponenti;

            //Assert
            CollectionAssert.IsEmpty(codiciFiscaliComponenti);
        }

        [Test]
        public void IlNumeroDeiComponentiECorrettamenteRestituito()
        {
            //Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;

            //Act
            var numeroComponenti = cp.NumeroComponenti;

            //Assert
            Assert.That(numeroComponenti, Is.EqualTo(5));
        }

        [Test]
        public void AccessoAlCodiceFiscalPartenzaSollevaEccezioneSeEPiuDiUno()
        {
            //Arrange
            var cp = this.partenzaDiCinquePersoneConUnicoCapopartenzaEUnicoAutista;
            cp.Componenti.Add(
                    new Componente()
                    {
                        CodiceFiscale = "ZZY",
                        CodiceMezzo = "M1",
                        Ruoli = new HashSet<Componente.Ruolo>() { Componente.Ruolo.CapoPartenza }
                    });
            //Act & Assert
            Assert.That(() => cp.CodiceFiscaleCapopartenza,
              Throws.Exception.TypeOf<ComposizionePartenzaException>());
        }
    }
}
