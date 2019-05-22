using Newtonsoft.Json;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetSediMarker : IGetSediMarker
    {
        public List<SintesiSedeMarker> GetListaSediMarker()
        {
            string filepath = "Fake/fakeMarkerSede.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiSedeMarker> ListaSedi = JsonConvert.DeserializeObject<List<SintesiSedeMarker>>(json);

            return ListaSedi;
        }
    }
}
