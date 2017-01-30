using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using NUnit.Framework;

namespace Modello.test.Classi.Soccorso
{
    [TestFixture]
    public class TestRichiestaAssistenza
    {
        [Test]
        public void SeLaListaDiEventiEVuotaNonCiSonoChiamate()
        {
            var richiesta = new RichiestaAssistenza();

            var chiamate = richiesta.Telefonate;

            Assert.That(chiamate.Count, Is.Zero);
        }

        [Test]
        public void UnaSingolaChiamataECorrettamenteInserita()
        {
            var richiesta = new RichiestaAssistenza();
            var telefonata = new Telefonata();
            richiesta.Eventi.Add(telefonata);

            var telefonate = richiesta.Telefonate;

            Assert.That(telefonate.Count, Is.EqualTo(1));
        }
    }
}
