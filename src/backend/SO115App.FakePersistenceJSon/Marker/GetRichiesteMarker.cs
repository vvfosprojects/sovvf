using Newtonsoft.Json;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetRichiesteMarker : IGetRichiesteMarker
    {
        public List<SintesiRichiestaMarker> GetListaRichiesteMarker()
        {
            string filepath = "Fake/fakeMarkerRichiesta.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiRichiestaMarker> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichiestaMarker>>(json);

            return ListaRichieste;
        }
    }
}
