using Newtonsoft.Json;
using SO115App.API.Models.Classi.ListaEventi;
using SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi;
using SO115App.Models.Classi.ListaEventi;
using SO115App.Models.Servizi.Infrastruttura.GetListaEventi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.ListaEventi
{
    public class GetListaEventi : IGetListaEventi
    {
        public List<Eventi> Get(ListaEventiQuery query)
        {
            List<Eventi> eventi = new List<Eventi>();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiesteAssistenza> richieste = JsonConvert.DeserializeObject<List<RichiesteAssistenza>>(json);
            richieste = richieste.Where(x => x.Id == query.Id).ToList();
            eventi = richieste.Select(x => x.Eventi).FirstOrDefault();

            return eventi;
        }
    }
}
