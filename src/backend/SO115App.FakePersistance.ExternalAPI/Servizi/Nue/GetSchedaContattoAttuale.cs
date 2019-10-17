using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedaContattoAttuale : IGetSchedaContattoAttuale
    {
        private readonly HttpClient _client;

        public GetSchedaContattoAttuale(HttpClient client)
        {
            _client = client;
        }

        public SchedaContatto SchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/SchedaContattoAttuale/codiceSede={0}&codiceOperatore={1}", codiceSede, codiceOperatore));
            return JsonConvert.DeserializeObject<SchedaContatto>(response.ToString());
        }
    }
}
