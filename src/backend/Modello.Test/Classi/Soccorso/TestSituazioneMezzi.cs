//-----------------------------------------------------------------------
// <copyright file="TestSituazioneMezzi.cs" company="CNVVF">
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
using Modello.Classi.Organigramma;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.SituazioneMezzo;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.Implementation;
using Modello.Servizi.Infrastruttura.Organigramma;
using Moq;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso
{
    [TestFixture]
    public class TestSituazioneMezzi
    {
        [Test]
        public void Due_Richieste_Con_4_Mezzi_Assegnati_restituisce_4_situazioni()
        {
            IEnumerable<SituazioneMezzo> expected;
            var richiesta1 = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected);
            var richiesta2 = this.Crea_Richiesta_Con_M3_e_M4_assegnati_e_M3_sul_posto_e_in_viaggio(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta1, richiesta2 };
            var getSituazioneMezzi = this.CreaServizio(richieste);
            var situazioneMezzi = getSituazioneMezzi.Get(new HashSet<PinNodo>());

            Assert.That(situazioneMezzi.Count(), Is.EqualTo(4));
        }

        [Test]
        public void RestituisceUnaSituazioneVuotaSeNonCiSonoRichieste()
        {
            var mockGetCodiciUnitaOperativeVisibiliPerSoccorso = new Mock<IGetUnitaOperativeVisibiliPerSoccorso>();
            mockGetCodiciUnitaOperativeVisibiliPerSoccorso
                .Setup(m => m.Get())
                .Returns(Enumerable.Empty<string>);

            var mockUnitaOperativa = new Mock<UnitaOperativa>();
            mockUnitaOperativa
                .Setup(m => m.GetSottoAlbero(It.IsAny<IEnumerable<PinNodo>>()))
                .Returns(Enumerable.Repeat<UnitaOperativa>(new UnitaOperativa("MI", "MI"), 1));

            var mockEspandiPinsNodoSuOrganigramma = new Mock<IEspandiPinNodoSuOrganigramma>();
            mockEspandiPinsNodoSuOrganigramma
                .Setup(m => m.Espandi(It.IsAny<IEnumerable<PinNodo>>()))
                .Returns(Enumerable.Repeat<string>("MI", 1));

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(Enumerable.Empty<RichiestaAssistenza>());

            var getSituazioneMezzi = new GetSituazioneMezzi(
                mockGetCodiciUnitaOperativeVisibiliPerSoccorso.Object,
                mockEspandiPinsNodoSuOrganigramma.Object,
                mockGetRichiestePerSituazioneMezzi.Object);

            var result = getSituazioneMezzi.Get(new HashSet<PinNodo>());

            Assert.That(result, Is.Empty);
        }

        [Test]
        public void Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto_restituisce_2_situazioni()
        {
            IEnumerable<SituazioneMezzo> expected;
            var richiesta = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var getSituazioneMezzi = this.CreaServizio(richieste);
            var resultDto = getSituazioneMezzi.Get(new HashSet<PinNodo>());

            Assert.That(resultDto.Count(), Is.EqualTo(2));
        }

        [Test]
        public void Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto_restituisce_le_giuste_situazioni_mezzo()
        {
            IEnumerable<SituazioneMezzo> expected;
            var richiesta = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var getSituazioneMezzi = this.CreaServizio(richieste);
            var situazioneMezzi = getSituazioneMezzi.Get(new HashSet<PinNodo>());
            var situazioneM1 = situazioneMezzi.Single(sm => sm.Codice == "M1");
            var situazioneM2 = situazioneMezzi.Single(sm => sm.Codice == "M2");
            var expectedM1 = expected.Single(sm => sm.Codice == "M1");
            var expectedM2 = expected.Single(sm => sm.Codice == "M2");

            Assert.That(situazioneM1.Codice, Is.EqualTo(expectedM1.Codice));
            Assert.That(situazioneM1.CodiceRichiestaAssistenza, Is.EqualTo(expectedM1.CodiceRichiestaAssistenza));
            Assert.That(situazioneM1.IstanteAggiornamentoStato, Is.EqualTo(expectedM1.IstanteAggiornamentoStato));
            Assert.That(situazioneM1.CodiceStato, Is.EqualTo(expectedM1.CodiceStato));
            Assert.That(situazioneM2.Codice, Is.EqualTo(expectedM2.Codice));
            Assert.That(situazioneM2.CodiceRichiestaAssistenza, Is.EqualTo(expectedM2.CodiceRichiestaAssistenza));
            Assert.That(situazioneM2.IstanteAggiornamentoStato, Is.EqualTo(expectedM2.IstanteAggiornamentoStato));
            Assert.That(situazioneM2.CodiceStato, Is.EqualTo(expectedM2.CodiceStato));
        }

        [Test]
        public void Richiesta_Con_M1_M2_M3_M4_assegnati_e_M1_M3_in_viaggio_e_M2_M4_sul_posto_restituisce_le_giuste_situazioni_mezzo()
        {
            IEnumerable<SituazioneMezzo> expected1;
            IEnumerable<SituazioneMezzo> expected2;
            var richiesta1 = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected1);
            var richiesta2 = this.Crea_Richiesta_Con_M3_e_M4_assegnati_e_M3_sul_posto_e_in_viaggio(out expected2);
            var richieste = new List<RichiestaAssistenza>() { richiesta1, richiesta2 };
            var getSituazioneMezzi = this.CreaServizio(richieste);
            var situazioneMezzi = getSituazioneMezzi.Get(new HashSet<PinNodo>());
            var situazioneM1 = situazioneMezzi.Single(sm => sm.Codice == "M1");
            var situazioneM2 = situazioneMezzi.Single(sm => sm.Codice == "M2");
            var situazioneM3 = situazioneMezzi.Single(sm => sm.Codice == "M3");
            var situazioneM4 = situazioneMezzi.Single(sm => sm.Codice == "M4");
            var expectedM1 = expected1.Single(sm => sm.Codice == "M1");
            var expectedM2 = expected1.Single(sm => sm.Codice == "M2");
            var expectedM3 = expected2.Single(sm => sm.Codice == "M3");
            var expectedM4 = expected2.Single(sm => sm.Codice == "M4");

            Assert.That(situazioneM1.Codice, Is.EqualTo(expectedM1.Codice));
            Assert.That(situazioneM1.CodiceRichiestaAssistenza, Is.EqualTo(expectedM1.CodiceRichiestaAssistenza));
            Assert.That(situazioneM1.IstanteAggiornamentoStato, Is.EqualTo(expectedM1.IstanteAggiornamentoStato));
            Assert.That(situazioneM1.CodiceStato, Is.EqualTo(expectedM1.CodiceStato));
            Assert.That(situazioneM2.Codice, Is.EqualTo(expectedM2.Codice));
            Assert.That(situazioneM2.CodiceRichiestaAssistenza, Is.EqualTo(expectedM2.CodiceRichiestaAssistenza));
            Assert.That(situazioneM2.IstanteAggiornamentoStato, Is.EqualTo(expectedM2.IstanteAggiornamentoStato));
            Assert.That(situazioneM2.CodiceStato, Is.EqualTo(expectedM2.CodiceStato));
            Assert.That(situazioneM3.Codice, Is.EqualTo(expectedM3.Codice));
            Assert.That(situazioneM3.CodiceRichiestaAssistenza, Is.EqualTo(expectedM3.CodiceRichiestaAssistenza));
            Assert.That(situazioneM3.IstanteAggiornamentoStato, Is.EqualTo(expectedM3.IstanteAggiornamentoStato));
            Assert.That(situazioneM3.CodiceStato, Is.EqualTo(expectedM3.CodiceStato));
            Assert.That(situazioneM4.Codice, Is.EqualTo(expectedM4.Codice));
            Assert.That(situazioneM4.CodiceRichiestaAssistenza, Is.EqualTo(expectedM4.CodiceRichiestaAssistenza));
            Assert.That(situazioneM4.IstanteAggiornamentoStato, Is.EqualTo(expectedM4.IstanteAggiornamentoStato));
            Assert.That(situazioneM4.CodiceStato, Is.EqualTo(expectedM4.CodiceStato));
        }

        [Test]
        public void UnaUnicaRichiestaContenenteUnicoEventoDiComposizioneRestituisceGiustaSituazioneMezzo()
        {
            SituazioneMezzo expected;
            var richiesta = this.CreaRichiestaContenenteUnicoEventoDiComposizione(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var getSituazioneMezzi = this.CreaServizio(richieste);
            var situazioneMezzi = getSituazioneMezzi.Get(new HashSet<PinNodo>());
            var situazione = situazioneMezzi.Single(sm => sm.Codice == "M1");

            Assert.That(situazione.Codice, Is.EqualTo(expected.Codice));
            Assert.That(situazione.CodiceRichiestaAssistenza, Is.EqualTo(expected.CodiceRichiestaAssistenza));
            Assert.That(situazione.IstanteAggiornamentoStato, Is.EqualTo(expected.IstanteAggiornamentoStato));
            Assert.That(situazione.CodiceStato, Is.TypeOf(expected.CodiceStato.GetType()));
        }

        [Test]
        public void UnaUnicaRichiestaContenenteUnicoEventoDiComposizioneRestituisceUnaSolaSituazioneMezzo()
        {
            SituazioneMezzo expected;
            var richiesta = this.CreaRichiestaContenenteUnicoEventoDiComposizione(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var getSituazioneMezzi = this.CreaServizio(richieste);
            var situazioneMezzi = getSituazioneMezzi.Get(new HashSet<PinNodo>());

            Assert.That(situazioneMezzi.Count(), Is.EqualTo(1));
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out IEnumerable<SituazioneMezzo> expected)
        {
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R1",
            };

            var componentePartenza1 = new ComponentePartenza("CF1", "M1");
            var componentePartenza2 = new ComponentePartenza("CF2", "M2");
            var istanteEvento1 = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(richiesta, istanteEvento1, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEvento2 = DateTime.Now.AddMinutes(-7);
            var eventoUscita = new UscitaPartenza(richiesta, "M1", istanteEvento2, "Fonte");
            var istanteEvento3 = DateTime.Now.AddMinutes(-4);
            var eventoSulPosto = new ArrivoSulPosto(richiesta, "M1", istanteEvento3, "Fonte");
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo()
                {
                    Codice = "M1",
                    CodiceStato = new SulPosto().Codice,
                    CodiceRichiestaAssistenza = "R1",
                    IstanteAggiornamentoStato = istanteEvento3
                },
                new SituazioneMezzo()
                {
                    Codice = "M2",
                    CodiceStato = new Assegnato().Codice,
                    CodiceRichiestaAssistenza = "R1",
                    IstanteAggiornamentoStato = istanteEvento1
                }
            };
            return richiesta;
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M3_e_M4_assegnati_e_M3_sul_posto_e_in_viaggio(out IEnumerable<SituazioneMezzo> expected)
        {
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R2",
            };

            var componentePartenza1 = new ComponentePartenza("CF3", "M3");
            var componentePartenza2 = new ComponentePartenza("CF4", "M4");
            var istanteEvento1 = DateTime.Now.AddMinutes(-11);
            var eventoComposizione = new ComposizionePartenze(richiesta, istanteEvento1, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEvento2 = DateTime.Now.AddMinutes(-6);
            var eventoUscita = new UscitaPartenza(richiesta, "M4", istanteEvento2, "Fonte");
            var istanteEvento3 = DateTime.Now.AddMinutes(-3);
            var eventoSulPosto = new ArrivoSulPosto(richiesta, "M4", istanteEvento3, "Fonte");
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo()
                {
                    Codice = "M4",
                    CodiceStato = new SulPosto().Codice,
                    CodiceRichiestaAssistenza = "R2",
                    IstanteAggiornamentoStato = istanteEvento3
                },
                new SituazioneMezzo()
                {
                    Codice = "M3",
                    CodiceStato = new Assegnato().Codice,
                    CodiceRichiestaAssistenza = "R2",
                    IstanteAggiornamentoStato = istanteEvento1
                },
            };
            return richiesta;
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M3_e_M4_assegnati_e_M4_in_sede_e_M3_in_rientro(out IEnumerable<SituazioneMezzo> expected)
        {
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R2",
            };
            var componentePartenza1 = new ComponentePartenza("CF3", "M3");
            var componentePartenza2 = new ComponentePartenza("CF4", "M4");
            var istanteEventoAssegnazione = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(richiesta, istanteEventoAssegnazione, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEventoUscitaM3 = DateTime.Now.AddMinutes(-7);
            var eventoUscitaM3 = new UscitaPartenza(richiesta, "M3", istanteEventoUscitaM3, "Fonte");
            var istanteSulPostoM3 = DateTime.Now.AddMinutes(-4);
            var eventoSulPostoM3 = new ArrivoSulPosto(richiesta, "M3", istanteSulPostoM3, "Fonte");
            var istanteInRientroM3 = DateTime.Now.AddMinutes(-4);
            var eventoInRientroM3 = new ArrivoSulPosto(richiesta, "M3", istanteInRientroM3, "Fonte");
            var istanteEventoUscitaM4 = DateTime.Now.AddMinutes(-7);
            var eventoUscitaM4 = new UscitaPartenza(richiesta, "M4", istanteEventoUscitaM4, "Fonte");
            var istanteSulPostoM4 = DateTime.Now.AddMinutes(-4);
            var eventoSulPostoM4 = new ArrivoSulPosto(richiesta, "M4", istanteSulPostoM4, "Fonte");
            var istanteInRientroM4 = DateTime.Now.AddMinutes(-4);
            var eventoInRientroM4 = new PartenzaInRientro(richiesta, "M4", istanteInRientroM4, "Fonte");
            var istanteRientratoM4 = DateTime.Now.AddMinutes(-4);
            var eventoRientratoM4 = new PartenzaRientrata(richiesta, "M4", istanteRientratoM4, "Fonte");
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo()
                {
                    Codice = "M3",
                    CodiceStato = new InRientro().Codice,
                    CodiceRichiestaAssistenza = "R2",
                    IstanteAggiornamentoStato = istanteSulPostoM3
                },
                new SituazioneMezzo()
                {
                    Codice = "M4",
                    CodiceStato = new InSede().Codice,
                    CodiceRichiestaAssistenza = "R2",
                    IstanteAggiornamentoStato = istanteRientratoM4
                },
            };
            return richiesta;
        }

        private RichiestaAssistenza Crea_Richiesta_R1_Con_M1_e_M2_assegnati_e_M1_sganciato_e_M2_in_viaggio(out IEnumerable<SituazioneMezzo> expected)
        {
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R1",
            };
            var richiestaSubentrata = new RichiestaAssistenza()
            {
                Codice = "R2",
            };
            var componentePartenza1 = new ComponentePartenza("CF1", "M1");
            var componentePartenza2 = new ComponentePartenza("CF2", "M2");
            var istanteEventoAssegnazione = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(richiesta, istanteEventoAssegnazione, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEventoUscitaM1 = DateTime.Now.AddMinutes(-7);
            var eventoUscitaM1 = new UscitaPartenza(richiesta, "M1", istanteEventoUscitaM1, "Fonte");
            var istanteSulPostoM1 = DateTime.Now.AddMinutes(-4);
            var eventoSulPostoM1 = new ArrivoSulPosto(richiesta, "M1", istanteSulPostoM1, "Fonte");
            var istanteSganciatoM1 = DateTime.Now.AddMinutes(-2);
            var eventoSganciatoM1 = new RevocaPerRiassegnazione(richiesta, richiestaSubentrata, "M1", istanteSganciatoM1, "Fonte");
            var istanteEventoUscitaM2 = DateTime.Now.AddMinutes(-8);
            var eventoUscitaM2 = new UscitaPartenza(richiesta, "M2", istanteEventoUscitaM2, "Fonte");
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo()
                {
                    Codice = "M1",
                    CodiceStato = new InViaggio().Codice,
                    CodiceRichiestaAssistenza = "R1",
                    IstanteAggiornamentoStato = istanteSganciatoM1
                },
                new SituazioneMezzo()
                {
                    Codice = "M2",
                    CodiceStato = new InViaggio().Codice,
                    CodiceRichiestaAssistenza = "R2",
                    IstanteAggiornamentoStato = istanteEventoUscitaM2
                },
            };
            return richiesta;
        }

        private GetSituazioneMezzi CreaServizio(IEnumerable<RichiestaAssistenza> richieste)
        {
            var mockGetCodiciUnitaOperativeVisibiliPerSoccorso = new Mock<IGetUnitaOperativeVisibiliPerSoccorso>();
            mockGetCodiciUnitaOperativeVisibiliPerSoccorso
                .Setup(m => m.Get())
                .Returns(Enumerable.Empty<string>);

            var mockUnitaOperativa = new Mock<UnitaOperativa>();
            mockUnitaOperativa
                .Setup(m => m.GetSottoAlbero(It.IsAny<IEnumerable<PinNodo>>()))
                .Returns(Enumerable.Repeat<UnitaOperativa>(new UnitaOperativa("MI", "MI"), 1));

            var mockEspandiPinsNodoSuOrganigramma = new Mock<IEspandiPinNodoSuOrganigramma>();
            mockEspandiPinsNodoSuOrganigramma
                .Setup(m => m.Espandi(It.IsAny<IEnumerable<PinNodo>>()))
                .Returns(Enumerable.Repeat<string>("MI", 1));

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(richieste);

            var getSituezioneMezzi = new GetSituazioneMezzi(
                mockGetCodiciUnitaOperativeVisibiliPerSoccorso.Object,
                mockEspandiPinsNodoSuOrganigramma.Object,
                mockGetRichiestePerSituazioneMezzi.Object);

            return getSituezioneMezzi;
        }

        private RichiestaAssistenza CreaRichiestaContenenteUnicoEventoDiComposizione(out SituazioneMezzo expected)
        {
            var richiestaConUnicoEventoDiAssegnazione = new RichiestaAssistenza()
            {
                Codice = "R1",
            };
            var componentePartenza = new ComponentePartenza("CF1", "M1");
            var istanteEvento = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(richiestaConUnicoEventoDiAssegnazione, istanteEvento, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza }
            };
            expected = new SituazioneMezzo()
            {
                Codice = "M1",
                CodiceStato = new Assegnato().Codice,
                CodiceRichiestaAssistenza = "R1",
                IstanteAggiornamentoStato = istanteEvento
            };
            return richiestaConUnicoEventoDiAssegnazione;
        }
    }
}
