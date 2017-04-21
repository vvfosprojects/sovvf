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
        public void RestituisceUnaSituazioneVuotaSeNonCiSonoRichieste()
        {
            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(Enumerable.Empty<RichiestaAssistenza>);

            var mockGetUnitaOperativaPerCodice = new Mock<IGetUnitaOperativaPerCodice>();
            mockGetUnitaOperativaPerCodice
                .Setup(m => m.Get(It.IsAny<string>()))
                .Returns((string codice) => new UnitaOperativa() { Codice = codice, Nome = codice });

            var query = new SituazioneMezziQueryHandler(
                mockGetRichiestePerSituazioneMezzi.Object,
                mockGetUnitaOperativaPerCodice.Object);

            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });

            Assert.That(resultDto.SituazioneMezzi, Is.Empty);
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

        private RichiestaAssistenza CreaRichiestaContenenteUnicoEventoDiComposizione(out SituazioneMezzo expected)
        {
            var componentePartenza = new ComponentePartenza()
            {
                CodiceFiscale = "CF1",
                CodiceMezzo = "M1"
            };

            var istanteEvento = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze()
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza },
                Istante = istanteEvento
            };

            var richiestaConUnicoEventoDiAssegnazione = new RichiestaAssistenza()
            {
                Codice = "R1",
                Eventi = new List<Evento>()
                {
                    eventoComposizione
                }
            };

            expected = new SituazioneMezzo()
            {
                CodiceMezzo = "M1",
                IstanteAggiornamento = istanteEvento,
                StatoMezzo = new Assegnato(),
                CodiceRichiestaAssistenza = "R1"
            };

            return richiestaConUnicoEventoDiAssegnazione;
        }

        private SituazioneMezziQueryHandler CreaQuery(IEnumerable<RichiestaAssistenza> richieste)
        {
            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(richieste);

            var mockGetUnitaOperativaPerCodice = new Mock<IGetUnitaOperativaPerCodice>();
            mockGetUnitaOperativaPerCodice
                .Setup(m => m.Get(It.IsAny<string>()))
                .Returns((string codice) => new UnitaOperativa() { Codice = codice, Nome = codice });

            var query = new SituazioneMezziQueryHandler(
                mockGetRichiestePerSituazioneMezzi.Object,
                mockGetUnitaOperativaPerCodice.Object);

            return query;
        }

        private RichiestaAssistenza Crea_Richiesta_Con_M1_e_M2_assegnati_e_M1_in_viaggio_e_sul_posto(out IEnumerable<SituazioneMezzo> expected)
        {
            var componentePartenza1 = new ComponentePartenza()
            {
                CodiceFiscale = "CF1",
                CodiceMezzo = "M1"
            };

            var componentePartenza2 = new ComponentePartenza()
            {
                CodiceFiscale = "CF2",
                CodiceMezzo = "M2"
            };

            var istanteEvento1 = DateTime.Now.AddMinutes(-10);
            var eventoComposizione = new ComposizionePartenze()
            {
                Componenti = new HashSet<ComponentePartenza>() { componentePartenza1, componentePartenza2 },
                Istante = istanteEvento1
            };

            var istanteEvento2 = DateTime.Now.AddMinutes(-7);
            var eventoUscita = new UscitaPartenza()
            {
                CodiceMezzo = "M1",
                Istante = istanteEvento2
            };

            var istanteEvento3 = DateTime.Now.AddMinutes(-4);
            var eventoSulPosto = new ArrivoSulPosto()
            {
                CodiceMezzo = "M1",
                Istante = istanteEvento3
            };

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
                new SituazioneMezzo()
                {
                    CodiceMezzo = "M1",
                    IstanteAggiornamento = istanteEvento3,
                    StatoMezzo = new SulPosto(),
                    CodiceRichiestaAssistenza = "R1"
                },
                new SituazioneMezzo()
                {
                    CodiceMezzo = "M2",
                    IstanteAggiornamento = istanteEvento1,
                    StatoMezzo = new Assegnato(),
                    CodiceRichiestaAssistenza = "R1"
                }
            };

            return richiesta;
        }
    }
}
