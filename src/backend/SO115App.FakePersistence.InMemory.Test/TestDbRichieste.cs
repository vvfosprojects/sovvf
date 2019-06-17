using NUnit.Framework;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.FakePersistence.InMemory;
using System.Linq;

namespace Tests
{
    public class Tests
    {
        [Test]
        public void UnaRichiestaAggiuntaENelDatabase()
        {
            var richiesta = new RichiestaAssistenza();
            var dbRichieste = new DbRichieste();

            dbRichieste.Save(richiesta);
            var numeroRichieste = dbRichieste.GetRichieste().Count();

            Assert.That(numeroRichieste, Is.EqualTo(1));
        }

        [Test]
        public void UnaRichiestaAggiuntaHaIdNonVuoto()
        {
            var richiesta = new RichiestaAssistenza();
            var dbRichieste = new DbRichieste();

            dbRichieste.Save(richiesta);
            var id = dbRichieste.GetRichieste().Single().Id;

            Assert.That(id, Is.Not.Null.And.Not.Empty);
        }

        [Test]
        public void UnaRichiestaAggiuntaPuoEsserePrelevataPerId()
        {
            var richiesta = new RichiestaAssistenza();
            var dbRichieste = new DbRichieste();

            dbRichieste.Save(richiesta);
            var id = dbRichieste.GetRichieste().Single().Id;

            Assert.DoesNotThrow(() =>
            {
                var richiestaSalvata = dbRichieste.GetById(id);
            });
        }
    }
}
