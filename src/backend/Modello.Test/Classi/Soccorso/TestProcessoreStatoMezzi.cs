using System;
using System.Collections.Generic;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestProcessoreStatoMezzi
    {
        [Test]
        public void UnaRichiestaConUnMezzoAssegnatoRestituisceLoStatoAssegnato()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoPartitoRestituisceLoStatoInViaggio()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoSulPostoRestituisceLoStatoSulPosto()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoPartitoDalPostoRestituisceLoStatoInRientro()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoRientratoInSedeRestituisceLoStatoInSede()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoRiassegnatoPrimaDelRientroRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoRiassegnatoDopoLArrivoRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoRiassegnatoDopoLUscitaRestituisceLoStatoLibero()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoRevocatoDopoLaComposizioneRestituisceLoStatoInSede()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var richiestaSubentrata = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
        public void UnaRichiestaConUnMezzoRientratoEPoiDiNuovoUscitoRestituisceLoStatoInViaggio()
        {
            var processoreStato = new ProcessoreStato();
            var richiesta = new RichiestaAssistenza();
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
            var eventi = new IPartenza[] {
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
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
            var eventi = new IPartenza[] {
                new ComposizionePartenze(richiesta, DateTime.Now, "fonte")
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
    }
}
