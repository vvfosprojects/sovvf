//-----------------------------------------------------------------------
// <copyright file="TestRichiestaAssistenzaStatiMezzo.cs" company="CNVVF">
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
using System.Linq;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestRichiestaAssistenzaStatiMezzo
    {
        [Test]
        public void UnaRichiestaVuotaNonHaMezziCoinvolti()
        {
            var richiesta = new RichiestaAssistenza();

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            CollectionAssert.IsEmpty(mezziCoinvolti);
        }

        [Test]
        public void UnaRichiestaConUnMezzoAssegnatoRestituisceUnMezzoCoinvolto()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(1));
        }

        [Test]
        public void UnaRichiestaConUnMezzoAssegnatoRestituisceIlCodiceDelMezzoCoinvolto()
        {
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1")
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;
            var codiceMezzo = mezziCoinvolti.Keys.Single();

            Assert.That(codiceMezzo, Is.EqualTo("M1"));
        }

        [Test]
        public void UnaRichiestaConUnMezzoUscitoRestituisceUnMezzoCoinvolto()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                },
                new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte")
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(1));
        }

        [Test]
        public void UnaRichiestaConDueMezziInUnaComposizioneRestituisceDueStatiMezzo()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1"),
                        new ComponentePartenza("YYY", "M2"),
                    }
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(2));
        }

        [Test]
        public void UnaRichiestaConDueMezziInDueComposizioniRestituisceDueStatiMezzo()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1"),
                }
            };
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("YYY", "M2"),
                }
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(2));
        }

        [Test]
        public void UnaRichiestaConM1PartitoEdM2ArrivatoRestituisceIDueStatiCorrettamente()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
            {
                Componenti = new HashSet<ComponentePartenza>()
                {
                    new ComponentePartenza("XXX", "M1"),
                    new ComponentePartenza("YYY", "M2"),
                }
            };
            new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte");
            new UscitaPartenza(richiesta, "M2", DateTime.Now, "fonte");
            new ArrivoSulPosto(richiesta, "M2", DateTime.Now, "fonte");

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.Multiple(() =>
            {
                Assert.That(mezziCoinvolti, Has.Count.EqualTo(2));
                Assert.That(mezziCoinvolti["M1"], Is.InstanceOf<InViaggio>());
                Assert.That(mezziCoinvolti["M2"], Is.InstanceOf<SulPosto>());
            });
        }

        [Test]
        public void UnaRichiestaConUnMezzoRientratoEPoiDiNuovoUscitoRestituisceUnSoloMezzo()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                },
                new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte"),
                new ArrivoSulPosto(richiesta, "M1", DateTime.Now, "fonte"),
                new PartenzaInRientro(richiesta, "M1", DateTime.Now, "fonte"),
                new PartenzaRientrata(richiesta, "M1", DateTime.Now, "fonte"),
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("YYY", "M1")
                    }
                },
                new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte")
            };

            var mezziCoinvolti = richiesta.MezziCoinvolti;

            Assert.That(mezziCoinvolti, Has.Count.EqualTo(1));
        }
    }
}
