using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso;
using SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste;

namespace SOVVF.FakeImplementations.Test
{
    [TestFixture]
    public class TestGeneratoreRichieste
    {
        [Test]
        public void GeneraRichieste()
        {
            var gi = new GeneratoreRichieste("MI",
                5,
                DateTime.Now.AddMonths(-2),
                DateTime.Now,
                25,
                30 * 60,
                15 * 60,
                45 * 60,
                15 * 60,
                new float[] { .85F, .7F, .4F, .3F, .1F });

            var richieste = gi.Genera();
        }
    }
}
