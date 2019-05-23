using Newtonsoft.Json;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetMezziMarker : IGetMezziMarker
    {
        public List<SintesiMezzoMarker> GetListaMezziMarker()
        {
            string filepath = "Fake/fakeMarkerMezzo.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiMezzoMarker> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiMezzoMarker>>(json);

            return ListaRichieste;
        }
    }
}
