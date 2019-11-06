using MongoDB.Driver;
using NUnit.Framework;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.FakePersistenceJSon.GestioneIntervento;

namespace SO115App.Persistence.MongoDB.Test
{
    public class RichiestaAssistenzaTest
    {
        [Test]
        public void IlJsonDiUnaRichiestaEUgualeAlJsonDellaStessaRichiestaSalvataERecuperataDalDB()
        {
            var DBContext = new DbContext("mongodb://localhost:27017", "sovvf");
            var GestioneRichieste = new GetRichiestaById();
            var Salvataggio = new SaveRichiesta(DBContext);

            var richiesta = GestioneRichieste.Get("RM2391900000");
            Salvataggio.Save(richiesta);
            var richiestaDelDB = DBContext.RichiestaAssistenzaCollection.Find(x => x.Codice.Equals("RM2391900000")).First();

            Assert.IsInstanceOf<RichiestaAssistenza>(richiestaDelDB);
            //Assert.That(richiesta, Is.EqualTo(richiestaDelDB));
        }
    }
}
