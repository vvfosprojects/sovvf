using NUnit.Framework;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.FakePersistence.InMemory.Test
{
    [TestFixture]
    public class TestDbCodiciRichieste
    {
        [Test]
        public void IlPrimoCodiceGeneratoPerRomaERMDot00001()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            var nuovoCodiceRoma = dbCodiciRichieste.Genera("RM", 2020);

            Assert.That(nuovoCodiceRoma, Is.EqualTo("RM-20-00001"));
        }

        [Test]
        public void UnCodiceProvinciaDi1CarattereDaEccezione()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            Assert.Throws<ArgumentException>(() =>
            {
                dbCodiciRichieste.Genera("R", 2020);
            });
        }

        [Test]
        public void UnCodiceProvinciaDi3CaratteriDaEccezione()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            Assert.Throws<ArgumentException>(() =>
            {
                dbCodiciRichieste.Genera("RMM", 2020);
            });
        }

        [Test]
        public void IlSecondoCodiceGeneratoPerRomaERMDot00002()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            dbCodiciRichieste.Genera("RM", 2020);
            var secondoCodiceRoma = dbCodiciRichieste.Genera("RM", 2020);

            Assert.That(secondoCodiceRoma, Is.EqualTo("RM-20-00002"));
        }

        [Test]
        public void ICodiciGeneratiPerDueProvinceDiverseSonoEntrambi1()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            var nuovoCodiceRoma = dbCodiciRichieste.Genera("RM", 2020);
            var nuovoCodiceCuneo = dbCodiciRichieste.Genera("CN", 2020);

            Assert.Multiple(() =>
            {
                StringAssert.EndsWith("1", nuovoCodiceRoma);
                StringAssert.EndsWith("1", nuovoCodiceCuneo);
            });
        }

        [Test]
        public void ISecondiCodiciGeneratiPerDueProvinceDiverseSonoEntrambi2()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            dbCodiciRichieste.Genera("RM", 2020);
            dbCodiciRichieste.Genera("CN", 2020);
            var nuovoCodiceRoma = dbCodiciRichieste.Genera("RM", 2020);
            var nuovoCodiceCuneo = dbCodiciRichieste.Genera("CN", 2020);

            Assert.Multiple(() =>
            {
                StringAssert.EndsWith("2", nuovoCodiceRoma);
                StringAssert.EndsWith("2", nuovoCodiceCuneo);
            });
        }

        [Test]
        public void IPrimiCodiciGeneratiPerRomaInDueAnniDiversiSonoCorretti()
        {
            var dbCodiciRichieste = new DbCodiciRichieste();

            var nuovoCodiceRoma2020 = dbCodiciRichieste.Genera("RM", 2020);
            var nuovoCodiceRoma2021 = dbCodiciRichieste.Genera("RM", 2021);

            Assert.That(nuovoCodiceRoma2020, Is.EqualTo("RM-20-00001"));
            Assert.That(nuovoCodiceRoma2021, Is.EqualTo("RM-21-00001"));
        }
    }
}
