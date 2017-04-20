using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        private SituazioneMezziQueryHandler CreaQueryConUnicoEventoDiComposizione(out SituazioneMezzo expected)
        {
            var richiesta = this.CreaRichiestaContenenteUnicoEventoDiComposizione(out expected);

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(new List<RichiestaAssistenza>() { richiesta });

            var mockGetUnitaOperativaPerCodice = new Mock<IGetUnitaOperativaPerCodice>();
            mockGetUnitaOperativaPerCodice
                .Setup(m => m.Get(It.IsAny<string>()))
                .Returns((string codice) => new UnitaOperativa() { Codice = codice, Nome = codice });

            var query = new SituazioneMezziQueryHandler(
                mockGetRichiestePerSituazioneMezzi.Object,
                mockGetUnitaOperativaPerCodice.Object);

            return query;
        }

        [Test]
        public void UnaUnicaRichiestaContenenteUnicoEventoDiComposizioneRestituisceUnaSolaSituazioneMezzo()
        {
            SituazioneMezzo expected;
            var query = this.CreaQueryConUnicoEventoDiComposizione(out expected);

            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });

            Assert.That(resultDto.SituazioneMezzi.Count(), Is.EqualTo(1));
        }

        [Test]
        public void UnaUnicaRichiestaContenenteUnicoEventoDiComposizioneRestituisceGiustaSituazioneMezzo()
        {
            SituazioneMezzo expected;
            var query = this.CreaQueryConUnicoEventoDiComposizione(out expected);

            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });
            var situazione = resultDto.SituazioneMezzi.First();

            Assert.That(situazione.CodiceMezzo, Is.EqualTo(expected.CodiceMezzo));
            Assert.That(situazione.CodiceRichiestaAssistenza, Is.EqualTo(expected.CodiceRichiestaAssistenza));
            Assert.That(situazione.IstanteAggiornamento, Is.EqualTo(expected.IstanteAggiornamento));
            Assert.That(situazione.StatoMezzo, Is.TypeOf<Assegnato>());
        }
    }
}
