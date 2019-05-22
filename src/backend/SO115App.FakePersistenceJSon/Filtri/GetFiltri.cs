using Newtonsoft.Json;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;
using System;
using System.IO;

namespace SO115App.FakePersistenceJSon.Filtri
{
    public class GetFiltri : IGetFiltri
    {
        public API.Models.Classi.Filtri.Filtri Get()
        {
            string filepath = "Fake/Filtri.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            API.Models.Classi.Filtri.Filtri filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(json);

            return filtri;
        }
    }
}
