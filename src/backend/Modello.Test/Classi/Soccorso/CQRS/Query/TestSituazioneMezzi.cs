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
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Organigramma;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.Infrastruttura.Organigramma;
using Moq;
using NUnit.Framework;

namespace Modello.Test.Classi.Soccorso.CQRS.Query
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
            var query = this.CreaQuery(richieste);
            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            Assert.That(resultDto.SituazioneMezzi.Count(), Is.EqualTo(4));
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
                .Setup(m => m.GetSottoAlbero(It.IsAny<IEnumerable<TagNodo>>()))
                .Returns(Enumerable.Repeat<UnitaOperativa>(new UnitaOperativa { Codice = "MI", Nome = "MI" }, 1));

            var mockEspandiTagsNodoSuOrganigramma = new Mock<IEspandiTagsNodoSuOrganigramma>();
            mockEspandiTagsNodoSuOrganigramma
                .Setup(m => m.Espandi(It.IsAny<IEnumerable<TagNodo>>()))
                .Returns(Enumerable.Repeat<string>("MI", 1));

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(Enumerable.Empty<RichiestaAssistenza>());

            var query = new SituazioneMezziQueryHandler(
                mockGetCodiciUnitaOperativeVisibiliPerSoccorso.Object,
                mockEspandiTagsNodoSuOrganigramma.Object,
                mockGetRichiestePerSituazioneMezzi.Object);

            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });

            Assert.That(resultDto.SituazioneMezzi, Is.Empty);
        }

        [Test]
        public void RestituisceUnaSituazioneVuotaSeNonCiSonoUnitaOperativeDaAnalizzare()
        {
            var mockGetCodiciUnitaOperativeVisibiliPerSoccorso = new Mock<IGetUnitaOperativeVisibiliPerSoccorso>();
            mockGetCodiciUnitaOperativeVisibiliPerSoccorso
                .Setup(m => m.Get())
                .Throws(new InvalidOperationException());

            var mockUnitaOperativa = new Mock<UnitaOperativa>();
            mockUnitaOperativa
                .Setup(m => m.GetSottoAlbero(It.IsAny<IEnumerable<TagNodo>>()))
                .Returns(Enumerable.Empty<UnitaOperativa>());

            var mockEspandiTagsNodoSuOrganigramma = new Mock<IEspandiTagsNodoSuOrganigramma>();
            mockEspandiTagsNodoSuOrganigramma
                .Setup(m => m.Espandi(It.IsAny<IEnumerable<TagNodo>>()))
                .Returns(Enumerable.Empty<string>());

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(Enumerable.Empty<RichiestaAssistenza>());

            var query = new SituazioneMezziQueryHandler(
                mockGetCodiciUnitaOperativeVisibiliPerSoccorso.Object,
                mockEspandiTagsNodoSuOrganigramma.Object,
                mockGetRichiestePerSituazioneMezzi.Object);

            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });

            Assert.That(resultDto.SituazioneMezzi, Is.Empty);
        }

        [Test]
        public void Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto_restituisce_2_situazioni()
        {
            IEnumerable<SituazioneMezzo> expected;
            var richiesta = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var query = this.CreaQuery(richieste);
            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            Assert.That(resultDto.SituazioneMezzi.Count(), Is.EqualTo(2));
        }

        [Test]
        public void Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto_restituisce_le_giuste_situazioni_mezzo()
        {
            IEnumerable<SituazioneMezzo> expected;
            var richiesta = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var query = this.CreaQuery(richieste);
            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            var situazioneM1 = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M1");
            var situazioneM2 = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M2");
            var expectedM1 = expected.Single(sm => sm.CodiceMezzo == "M1");
            var expectedM2 = expected.Single(sm => sm.CodiceMezzo == "M2");
            Assert.That(situazioneM1.CodiceMezzo, Is.EqualTo(expectedM1.CodiceMezzo));
            Assert.That(situazioneM1.CodiceRichiestaAssistenza, Is.EqualTo(expectedM1.CodiceRichiestaAssistenza));
            Assert.That(situazioneM1.IstanteAggiornamento, Is.EqualTo(expectedM1.IstanteAggiornamento));
            Assert.That(situazioneM1.StatoMezzo, Is.TypeOf(expectedM1.StatoMezzo.GetType()));
            Assert.That(situazioneM2.CodiceMezzo, Is.EqualTo(expectedM2.CodiceMezzo));
            Assert.That(situazioneM2.CodiceRichiestaAssistenza, Is.EqualTo(expectedM2.CodiceRichiestaAssistenza));
            Assert.That(situazioneM2.IstanteAggiornamento, Is.EqualTo(expectedM2.IstanteAggiornamento));
            Assert.That(situazioneM2.StatoMezzo, Is.TypeOf(expectedM2.StatoMezzo.GetType()));
        }

        [Test]
        public void Richiesta_Con_M1_M2_M3_M4_assegnati_e_M1_M3_in_viaggio_e_M2_M4_sul_posto_restituisce_le_giuste_situazioni_mezzo()
        {
            IEnumerable<SituazioneMezzo> expected1;
            IEnumerable<SituazioneMezzo> expected2;
            var richiesta1 = this.Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out expected1);
            var richiesta2 = this.Crea_Richiesta_Con_M3_e_M4_assegnati_e_M3_sul_posto_e_in_viaggio(out expected2);
            var richieste = new List<RichiestaAssistenza>() { richiesta1, richiesta2 };
            var query = this.CreaQuery(richieste);
            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            var situazioneM1 = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M1");
            var situazioneM2 = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M2");
            var situazioneM3 = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M3");
            var situazioneM4 = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M4");
            var expectedM1 = expected1.Single(sm => sm.CodiceMezzo == "M1");
            var expectedM2 = expected1.Single(sm => sm.CodiceMezzo == "M2");
            var expectedM3 = expected2.Single(sm => sm.CodiceMezzo == "M3");
            var expectedM4 = expected2.Single(sm => sm.CodiceMezzo == "M4");
            Assert.That(situazioneM1.CodiceMezzo, Is.EqualTo(expectedM1.CodiceMezzo));
            Assert.That(situazioneM1.CodiceRichiestaAssistenza, Is.EqualTo(expectedM1.CodiceRichiestaAssistenza));
            Assert.That(situazioneM1.IstanteAggiornamento, Is.EqualTo(expectedM1.IstanteAggiornamento));
            Assert.That(situazioneM1.StatoMezzo, Is.TypeOf(expectedM1.StatoMezzo.GetType()));
            Assert.That(situazioneM2.CodiceMezzo, Is.EqualTo(expectedM2.CodiceMezzo));
            Assert.That(situazioneM2.CodiceRichiestaAssistenza, Is.EqualTo(expectedM2.CodiceRichiestaAssistenza));
            Assert.That(situazioneM2.IstanteAggiornamento, Is.EqualTo(expectedM2.IstanteAggiornamento));
            Assert.That(situazioneM2.StatoMezzo, Is.TypeOf(expectedM2.StatoMezzo.GetType()));
            Assert.That(situazioneM3.CodiceMezzo, Is.EqualTo(expectedM3.CodiceMezzo));
            Assert.That(situazioneM3.CodiceRichiestaAssistenza, Is.EqualTo(expectedM3.CodiceRichiestaAssistenza));
            Assert.That(situazioneM3.IstanteAggiornamento, Is.EqualTo(expectedM3.IstanteAggiornamento));
            Assert.That(situazioneM3.StatoMezzo, Is.TypeOf(expectedM3.StatoMezzo.GetType()));
            Assert.That(situazioneM4.CodiceMezzo, Is.EqualTo(expectedM4.CodiceMezzo));
            Assert.That(situazioneM4.CodiceRichiestaAssistenza, Is.EqualTo(expectedM4.CodiceRichiestaAssistenza));
            Assert.That(situazioneM4.IstanteAggiornamento, Is.EqualTo(expectedM4.IstanteAggiornamento));
            Assert.That(situazioneM4.StatoMezzo, Is.TypeOf(expectedM4.StatoMezzo.GetType()));
        }

        [Test]
        public void UnaUnicaRichiestaContenenteUnicoEventoDiComposizioneRestituisceGiustaSituazioneMezzo()
        {
            SituazioneMezzo expected;
            var richiesta = this.CreaRichiestaContenenteUnicoEventoDiComposizione(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var query = this.CreaQuery(richieste);
            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            var situazione = resultDto.SituazioneMezzi.Single(sm => sm.CodiceMezzo == "M1");
            Assert.That(situazione.CodiceMezzo, Is.EqualTo(expected.CodiceMezzo));
            Assert.That(situazione.CodiceRichiestaAssistenza, Is.EqualTo(expected.CodiceRichiestaAssistenza));
            Assert.That(situazione.IstanteAggiornamento, Is.EqualTo(expected.IstanteAggiornamento));
            Assert.That(situazione.StatoMezzo, Is.TypeOf(expected.StatoMezzo.GetType()));
        }

        [Test]
        public void UnaUnicaRichiestaContenenteUnicoEventoDiComposizioneRestituisceUnaSolaSituazioneMezzo()
        {
            SituazioneMezzo expected;
            var richiesta = this.CreaRichiestaContenenteUnicoEventoDiComposizione(out expected);
            var richieste = new List<RichiestaAssistenza>() { richiesta };
            var query = this.CreaQuery(richieste);
            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            Assert.That(resultDto.SituazioneMezzi.Count(), Is.EqualTo(1));
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out IEnumerable<SituazioneMezzo> expected)
        {
            var componentePartenza1 = new ComponentePartenza("CF1", "M1");
            var componentePartenza2 = new ComponentePartenza("CF2", "M2");
            var istanteEvento1 = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(istanteEvento1, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEvento2 = DateTime.Now.AddMinutes(-7);
            var eventoUscita = new UscitaPartenza("M1", istanteEvento2, "Fonte");
            var istanteEvento3 = DateTime.Now.AddMinutes(-4);
            var eventoSulPosto = new ArrivoSulPosto("M1", istanteEvento3, "Fonte");
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R1",
                Eventi = new List<Evento>()
                {
                    eventoComposizione,
                    eventoUscita,
                    eventoSulPosto
                }
            };
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo("M1", new SulPosto(), "R1", istanteEvento3),
                new SituazioneMezzo("M2", new Assegnato(), "R1", istanteEvento1)
            };
            return richiesta;
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M3_e_M4_assegnati_e_M3_sul_posto_e_in_viaggio(out IEnumerable<SituazioneMezzo> expected)
        {
            var componentePartenza1 = new ComponentePartenza("CF3", "M3");
            var componentePartenza2 = new ComponentePartenza("CF4", "M4");
            var istanteEvento1 = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(istanteEvento1, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEvento2 = DateTime.Now.AddMinutes(-7);
            var eventoUscita = new UscitaPartenza("M4", istanteEvento2, "Fonte");
            var istanteEvento3 = DateTime.Now.AddMinutes(-4);
            var eventoSulPosto = new ArrivoSulPosto("M4", istanteEvento3, "Fonte");
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R2",
                Eventi = new List<Evento>()
                {
                    eventoComposizione,
                    eventoUscita,
                    eventoSulPosto
                }
            };
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo("M4", new SulPosto(), "R2", istanteEvento3),
                new SituazioneMezzo("M3", new Assegnato(), "R2", istanteEvento1)
            };
            return richiesta;
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M3_e_M4_assegnati_e_M4_in_sede_e_M3_in_rientro(out IEnumerable<SituazioneMezzo> expected)
        {
            var componentePartenza1 = new ComponentePartenza("CF3", "M3");
            var componentePartenza2 = new ComponentePartenza("CF4", "M4");
            var istanteEventoAssegnazione = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(istanteEventoAssegnazione, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEventoUscitaM3 = DateTime.Now.AddMinutes(-7);
            var eventoUscitaM3 = new UscitaPartenza("M3", istanteEventoUscitaM3, "Fonte");
            var istanteSulPostoM3 = DateTime.Now.AddMinutes(-4);
            var eventoSulPostoM3 = new ArrivoSulPosto("M3", istanteSulPostoM3, "Fonte");
            var istanteInRientroM3 = DateTime.Now.AddMinutes(-4);
            var eventoInRientroM3 = new ArrivoSulPosto("M3", istanteInRientroM3, "Fonte");
            var istanteEventoUscitaM4 = DateTime.Now.AddMinutes(-7);
            var eventoUscitaM4 = new UscitaPartenza("M4", istanteEventoUscitaM4, "Fonte");
            var istanteSulPostoM4 = DateTime.Now.AddMinutes(-4);
            var eventoSulPostoM4 = new ArrivoSulPosto("M4", istanteSulPostoM4, "Fonte");
            var istanteInRientroM4 = DateTime.Now.AddMinutes(-4);
            var eventoInRientroM4 = new PartenzaInRientro("M4", istanteInRientroM4, "Fonte");
            var istanteRientratoM4 = DateTime.Now.AddMinutes(-4);
            var eventoRientratoM4 = new PartenzaRientrata("M4", istanteRientratoM4, "Fonte");
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R2",
                Eventi = new List<Evento>()
                {
                    eventoComposizione,
                    eventoUscitaM3,
                    eventoSulPostoM3,
                    eventoInRientroM3,
                    eventoUscitaM4,
                    eventoSulPostoM4,
                    eventoInRientroM4,
                    eventoRientratoM4
                }
            };
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo("M3", new InRientro(), "R2", istanteSulPostoM3),
                new SituazioneMezzo("M4", new InSede(), "R2", istanteRientratoM4)
            };
            return richiesta;
        }

        private RichiestaAssistenza Crea_Richiesta_R1_Con_M1_e_M2_assegnati_e_M1_sganciato_e_M2_in_viaggio(out IEnumerable<SituazioneMezzo> expected)
        {
            var componentePartenza1 = new ComponentePartenza("CF1", "M1");
            var componentePartenza2 = new ComponentePartenza("CF2", "M2");
            var istanteEventoAssegnazione = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(istanteEventoAssegnazione, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 }
            };
            var istanteEventoUscitaM1 = DateTime.Now.AddMinutes(-7);
            var eventoUscitaM1 = new UscitaPartenza("M1", istanteEventoUscitaM1, "Fonte");
            var istanteSulPostoM1 = DateTime.Now.AddMinutes(-4);
            var eventoSulPostoM1 = new ArrivoSulPosto("M1", istanteSulPostoM1, "Fonte");
            var istanteSganciatoM1 = DateTime.Now.AddMinutes(-2);
            var eventoSganciatoM1 = new Riassegnazione("R1", "M1", istanteSganciatoM1, "Fonte");
            var istanteEventoUscitaM2 = DateTime.Now.AddMinutes(-8);
            var eventoUscitaM2 = new UscitaPartenza("M2", istanteEventoUscitaM2, "Fonte");
            var richiesta = new RichiestaAssistenza()
            {
                Codice = "R1",
                Eventi = new List<Evento>()
                {
                    eventoComposizione,
                    eventoUscitaM1,
                    eventoSulPostoM1,
                    eventoSganciatoM1,
                    eventoUscitaM2,
                }
            };
            expected = new SituazioneMezzo[]
            {
                new SituazioneMezzo("M1", new InViaggio(), "R1", istanteSganciatoM1),
                new SituazioneMezzo("M2", new InViaggio(), "R2", istanteEventoUscitaM2)
            };
            return richiesta;
        }

        private SituazioneMezziQueryHandler CreaQuery(IEnumerable<RichiestaAssistenza> richieste)
        {
            var mockGetCodiciUnitaOperativeVisibiliPerSoccorso = new Mock<IGetUnitaOperativeVisibiliPerSoccorso>();
            mockGetCodiciUnitaOperativeVisibiliPerSoccorso
                .Setup(m => m.Get())
                .Returns(Enumerable.Empty<string>);

            var mockUnitaOperativa = new Mock<UnitaOperativa>();
            mockUnitaOperativa
                .Setup(m => m.GetSottoAlbero(It.IsAny<IEnumerable<TagNodo>>()))
                .Returns(Enumerable.Repeat<UnitaOperativa>(new UnitaOperativa { Codice = "MI", Nome = "MI" }, 1));

            var mockEspandiTagsNodoSuOrganigramma = new Mock<IEspandiTagsNodoSuOrganigramma>();
            mockEspandiTagsNodoSuOrganigramma
                .Setup(m => m.Espandi(It.IsAny<IEnumerable<TagNodo>>()))
                .Returns(Enumerable.Repeat<string>("MI", 1));

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(richieste);

            var query = new SituazioneMezziQueryHandler(
                mockGetCodiciUnitaOperativeVisibiliPerSoccorso.Object,
                mockEspandiTagsNodoSuOrganigramma.Object,
                mockGetRichiestePerSituazioneMezzi.Object);

            return query;
        }

        private RichiestaAssistenza CreaRichiestaContenenteUnicoEventoDiComposizione(out SituazioneMezzo expected)
        {
            var componentePartenza = new ComponentePartenza("CF1", "M1");
            var istanteEvento = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze(istanteEvento, "Fonte")
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza }
            };
            var richiestaConUnicoEventoDiAssegnazione = new RichiestaAssistenza()
            {
                Codice = "R1",
                Eventi = new List<Evento>()
                {
                    eventoComposizione
                }
            };
            expected = new SituazioneMezzo("M1", new Assegnato(), "R1", istanteEvento);
            return richiestaConUnicoEventoDiAssegnazione;
        }
    }
}
