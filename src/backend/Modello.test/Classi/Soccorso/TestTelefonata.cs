using Modello.Classi.Soccorso.Segnalazioni;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.test.Classi.Soccorso
{
    [TestFixture]
    public class TestTelefonata
    {
        [Test]
        public void LaTelefonataCheContieneTestoInIninfluentePercheEIninfluente()
        {
            var telefonata = new Telefonata()
            {
                IninfluentePerche = "Duplicata"
            };

            var ininfluente = telefonata.Ininfluente;

            Assert.That(ininfluente, Is.True);
        }

        [Test]
        public void LaTelefonataCheContieneSoloSpaziInIninfluentePercheEInfluente()
        {
            var telefonata = new Telefonata()
            {
                IninfluentePerche = "  "
            };

            var influente = !telefonata.Ininfluente;

            Assert.That(influente, Is.True);
        }

        [Test]
        public void LaTelefonataCheContieneSoloNullInIninfluentePercheEInfluente()
        {
            var telefonata = new Telefonata()
            {
                IninfluentePerche = null
            };

            var influente = !telefonata.Ininfluente;

            Assert.That(influente, Is.True);
        }

        [Test]
        public void LaTelefonataCheContieneStringaVuotaInIninfluentePercheEInfluente()
        {
            var telefonata = new Telefonata()
            {
                IninfluentePerche = string.Empty
            };

            var influente = !telefonata.Ininfluente;

            Assert.That(influente, Is.True);
        }
    }
}
