using NUnit.Framework;
using SO115App.GeneratoreRichiesteFake;

namespace Tests
{
    public class TestGeneratoreCoordinateInterventoPerUO
    {
        [Test]
        [Repeat(100)]
        public void GliInterventiDiTorinoSonoViciniATorino()
        {
            var generatore = new GeneratoreCoordinateInterventoPerUO();

            var coordinate = generatore.Genera("TO");

            Assert.That(coordinate.Latitudine, Is.GreaterThan(44.08).And.LessThan(46.08));
            Assert.That(coordinate.Longitudine, Is.GreaterThan(6.62).And.LessThan(8.62));
        }

        [Test]
        [Repeat(100)]
        public void GliInterventiDiSiracusaSonoViciniASiracusa()
        {
            var generatore = new GeneratoreCoordinateInterventoPerUO();

            var coordinate = generatore.Genera("SR");

            Assert.That(coordinate.Latitudine, Is.GreaterThan(36.08).And.LessThan(38.08));
            Assert.That(coordinate.Longitudine, Is.GreaterThan(14.18).And.LessThan(16.18));
        }
    }
}
