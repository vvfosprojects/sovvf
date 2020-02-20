using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistence.JSon.GestioneUtenti
{
    public class GetUtenteById : IGetUtenteById
    {
        Utente IGetUtenteById.GetUtenteByCodice(string id)
        {
            List<Utente> ListUtenti = new List<Utente>();

            string filepath = "Fake/user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            return ListUtenti.FirstOrDefault(x => x.Id == id);
        }
    }
}
