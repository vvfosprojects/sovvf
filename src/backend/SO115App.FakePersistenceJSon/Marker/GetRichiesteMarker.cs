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
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            List<SintesiRichiestaMarker> ListaRichieste = new List<SintesiRichiestaMarker>();

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichiestaMarker>>(json);

            if (ListaRichieste != null)
            { 
                int id = 0;
                foreach (SintesiRichiestaMarker sintesi in ListaRichieste)
                {
                    sintesi.Id = id.ToString();
                    id++;
                }

                return ListaRichieste;
            }
            else
            {
                List<SintesiRichiestaMarker> ListaRichiesteVuota = new List<SintesiRichiestaMarker>();
                return ListaRichiesteVuota;
            }
        }
    }
}
