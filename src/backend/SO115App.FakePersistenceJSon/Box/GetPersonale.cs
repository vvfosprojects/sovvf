using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.Models.Servizi.Infrastruttura.Box;
using System.IO;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetPersonale : IGetBoxPersonale
    {
        public BoxPersonale Get()
        {
            BoxPersonale personale = new BoxPersonale();

            string filepath = "Fake/ListaPersonale.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            personale = JsonConvert.DeserializeObject<BoxPersonale>(json);

            return personale;
        }
    }
}
