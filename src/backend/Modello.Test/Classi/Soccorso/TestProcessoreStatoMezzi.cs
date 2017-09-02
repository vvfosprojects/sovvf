//-----------------------------------------------------------------------
// <copyright file="TestProcessoreStatoMezzi.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestProcessoreStatoMezzi
    {
        [Test]
        public void UnEventoDiComposizioneMentreIlMezzoEInSedeRestituisceLoStatoAssegnato()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var fuoriSede = false;
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", fuoriSede)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                }
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<Assegnato>());
        }

        [Test]
        public void UnEventoDiComposizioneMentreIlMezzoNonEInSedeRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var fuoriSede = true;
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", fuoriSede)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                }
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<Libero>());
        }

        [Test]
        public void UnMezzoPartitoRestituisceLoStatoInViaggio()
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

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<InViaggio>());
        }

        [Test]
        public void UnMezzoSulPostoRestituisceLoStatoSulPosto()
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
                new ArrivoSulPosto(richiesta, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<SulPosto>());
        }

        [Test]
        public void UnMezzoPartitoDalPostoRestituisceLoStatoInRientro()
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
                new PartenzaInRientro(richiesta, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<InRientro>());
        }

        [Test]
        public void UnMezzoRientratoInSedeRestituisceLoStatoInSede()
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
                new PartenzaRientrata(richiesta, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<InSede>());
        }

        [Test]
        public void UnMezzoRiassegnatoPrimaDelRientroRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
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
                new RevocaPerRiassegnazione(richiesta, richiestaSubentrata, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<Libero>());
        }

        [Test]
        public void UnMezzoRiassegnatoDopoLArrivoRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
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
                new RevocaPerRiassegnazione(richiesta, richiestaSubentrata, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<Libero>());
        }

        [Test]
        public void UnMezzoRiassegnatoDopoLUscitaRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
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
                new RevocaPerRiassegnazione(richiesta, richiestaSubentrata, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<Libero>());
        }

        [Test]
        public void UnMezzoRevocatoDopoLaComposizioneRestituisceLoStatoInSede()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                },
                new RevocaPerRiassegnazione(richiesta, richiestaSubentrata, "M1", DateTime.Now, "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<InSede>());
        }

        [Test]
        public void UnMezzoRientratoEPoiDiNuovoUscitoRestituisceLoStatoInViaggio()
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

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<InViaggio>());
        }

        [Test]
        public void UnMezzoPuoAndareDirettamenteFuoriServizio()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[]
            {
                new VaInFuoriServizio(richiesta, "M1", DateTime.Now, "fonte", "test")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<FuoriServizio>());
        }

        [Test]
        public void UnMezzoAssegnatoPuoAndareFuoriServizio()
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
                new VaInFuoriServizio(richiesta, "M1", DateTime.Now, "fonte", "test")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<FuoriServizio>());
        }

        [Test]
        public void UnMezzoUscitoPuoAndareFuoriServizio()
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
                new VaInFuoriServizio(richiesta, "M1", DateTime.Now, "fonte", "test")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<FuoriServizio>());
        }

        [Test]
        public void UnMezzoArrivatoPuoAndareFuoriServizio()
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
                new VaInFuoriServizio(richiesta, "M1", DateTime.Now, "fonte", "test")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<FuoriServizio>());
        }

        [Test]
        public void UnMezzoPartitoPuoAndareFuoriServizio()
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
                new VaInFuoriServizio(richiesta, "M1", DateTime.Now, "fonte", "test")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<FuoriServizio>());
        }

        [Test]
        public void UnMezzoRientratoPuoAndareFuoriServizio()
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
                new VaInFuoriServizio(richiesta, "M1", DateTime.Now, "fonte", "test")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato, Is.InstanceOf<FuoriServizio>());
        }

        [Test]
        public void UnUnicoEventoProvocaUnaTransizioneNellIstanteDellEvento()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                }
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato.IstanteTransizione, Is.EqualTo(now));
        }

        [Test]
        public void LIstanteTransizioneRiportaLaDataDellUltimoEvento()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;
            var eventi = new IPartenza[]
            {
                new ComposizionePartenze(richiesta, now, "fonte", false)
                {
                    Componenti = new HashSet<ComponentePartenza>()
                    {
                        new ComponentePartenza("XXX", "M1")
                    }
                },
                new UscitaPartenza(richiesta, "M1", now.AddSeconds(1), "fonte"),
                new ArrivoSulPosto(richiesta, "M1", now.AddSeconds(2), "fonte")
            };

            var stato = processoreStato.ProcessaEventi(eventi).Stato;

            Assert.That(stato.IstanteTransizione, Is.EqualTo(now.AddSeconds(2)));
        }

        [Test]
        public void RichiedereLIstanteTransizioneSenzaEventiGeneraEccezione()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var now = DateTime.Now;

            var stato = processoreStato.ProcessaEventi(new IPartenza[0]).Stato;

            Assert.Throws<InvalidOperationException>(() =>
            {
                var istanteTransizione = stato.IstanteTransizione;
            });
        }

        [Test]
        public void UnMezzoInViaggioNonPuoEsserePartitoDalLuogo()
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
                new PartenzaInRientro(richiesta, "M1", DateTime.Now, "fonte"),
            };

            Assert.Throws<WorkflowException>(() =>
            {
                var stato = processoreStato.ProcessaEventi(eventi).Stato;
            });
        }

        [Test]
        public void UnMezzoSulPostoNonPuoEssereRientratoInSede()
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
                new PartenzaRientrata(richiesta, "M1", DateTime.Now, "fonte"),
            };

            Assert.Throws<WorkflowException>(() =>
            {
                var stato = processoreStato.ProcessaEventi(eventi).Stato;
            });
        }

        [Test]
        public void UnMezzoInSedeNonPuoEssereUscitoDallaSede()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[]
            {
                new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte"),
            };

            Assert.Throws<WorkflowException>(() =>
            {
                var stato = processoreStato.ProcessaEventi(eventi).Stato;
            });
        }

        [Test]
        public void UnMezzoSulPostoNonPuoEssereUscitoDallaSede()
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
                new UscitaPartenza(richiesta, "M1", DateTime.Now, "fonte"),
            };

            Assert.Throws<WorkflowException>(() =>
            {
                var stato = processoreStato.ProcessaEventi(eventi).Stato;
            });
        }
    }
}
