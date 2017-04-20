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

        [Test]
        public void RestituisceUnMezzoAssegnatoConUnicaRichiestaContenenteUnicoEventoDiComposizione()
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

            var mockGetRichiestePerSituazioneMezzi = new Mock<IGetRichiestePerSituazioneMezzi>();
            mockGetRichiestePerSituazioneMezzi
                .Setup(m => m.Get(It.IsAny<IEnumerable<string>>()))
                .Returns(new List<RichiestaAssistenza>() { richiestaConUnicoEventoDiAssegnazione });

            var mockGetUnitaOperativaPerCodice = new Mock<IGetUnitaOperativaPerCodice>();
            mockGetUnitaOperativaPerCodice
                .Setup(m => m.Get(It.IsAny<string>()))
                .Returns((string codice) => new UnitaOperativa() { Codice = codice, Nome = codice });

            var query = new SituazioneMezziQueryHandler(
                mockGetRichiestePerSituazioneMezzi.Object,
                mockGetUnitaOperativaPerCodice.Object);

            var resultDto = query.Handle(new SituazioneMezziQuery() { UnitaOperative = new HashSet<InfoUnitaOperativa>() });

            Assert.That(resultDto.SituazioneMezzi.Count(), Is.EqualTo(1));
            var actual = resultDto.SituazioneMezzi.First();
            var expected = new SituazioneMezzo()
            {
                CodiceMezzo = "M1",
                IstanteAggiornamento = istanteEvento,
                StatoMezzo = new Assegnato(),
                CodiceRichiestaAssistenza = "R1"
            };

            Assert.That(actual, Is.EqualTo(expected));
        }
    }
}
