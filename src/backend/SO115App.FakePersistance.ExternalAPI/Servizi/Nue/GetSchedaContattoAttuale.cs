using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedaContattoAttuale : IGetSchedaContattoAttuale
    {
        private HttpClient client = new HttpClient();

        public SchedaContatto SchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            SchedaContatto Scheda = new SchedaContatto();
            var response = client.GetStringAsync(string.Format(Costanti.NueUrl + "/SchedaContattoAttuale/codiceSede={0}&codiceOperatore={1}", codiceSede, codiceOperatore));
            Scheda = JsonConvert.DeserializeObject<SchedaContatto>(response.ToString());
            return Scheda;
        }
    }
}
