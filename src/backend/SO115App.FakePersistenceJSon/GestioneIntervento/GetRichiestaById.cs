using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetRichiestaById : IGetSintesiRichiestaAssistenzaById
    {
        public SintesiRichiesta Get(string idRichiestaAssistenza)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiRichiesta> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichiesta>>(json);

            SintesiRichiesta richiesta = (SintesiRichiesta)ListaRichieste.FirstOrDefault(x => x.Id == idRichiestaAssistenza);

            return richiesta;
        }
    }
}
