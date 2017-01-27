using Modello.Classi.Soccorso.Segnalazioni;
using NUnit.Framework;

namespace Modello.test.Classi.Soccorso
{
    [TestFixture]
    public class TestTelefonata
    {
        [Test]
        public void LaTelefonataCheContieneTestoInInutilePercheEInutile()
        {
            var telefonata = new Telefonata()
            {
                InutilePerche = "Duplicata"
            };

            var inutile = !telefonata.Utile;

            Assert.That(inutile, Is.True);
        }

        [Test]
        public void LaTelefonataCheContieneSoloSpaziInInutilePercheEUtile()
        {
            var telefonata = new Telefonata()
            {
                InutilePerche = "  "
            };

            var utile = telefonata.Utile;

            Assert.That(utile, Is.True);
        }

        [Test]
        public void LaTelefonataCheContieneSoloNullInInutilePercheEUtile()
        {
            var telefonata = new Telefonata()
            {
                InutilePerche = null
            };

            var utile = telefonata.Utile;

            Assert.That(utile, Is.True);
        }

        [Test]
        public void LaTelefonataCheContieneStringaVuotaInInutilePercheEUtile()
        {
            var telefonata = new Telefonata()
            {
                InutilePerche = string.Empty
            };

            var utile = telefonata.Utile;

            Assert.That(utile, Is.True);
        }
    }
}
