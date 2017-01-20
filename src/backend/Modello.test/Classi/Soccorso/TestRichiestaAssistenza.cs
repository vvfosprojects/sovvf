using Modello.Classi.Soccorso;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.test.Classi.Soccorso
{
    [TestFixture]
    public class TestRichiestaAssistenza
    {
        [Test]
        public void SeLaListaDiEventiEVuotaNonCiSonoChiamate()
        {
            var richiesta = new RichiestaAssistenza();

            var chiamate = richiesta.Chiamate;

            Assert.That(chiamate.Count, Is.Zero);
        }

        [Test]
        public void UnaSingolaChiamataECorrettamenteInserita()
        {
            var richiesta = new RichiestaAssistenza();
            var chiamata = new Chiamata();
            richiesta.Eventi.Add(chiamata);

            var chiamate = richiesta.Chiamate;

            Assert.That(chiamate.Count, Is.EqualTo(1));
        }
    }
}
