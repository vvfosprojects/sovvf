using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoByCodiciFiscali : IGetSchedeContattoByCodiciFiscali
    {
        private readonly HttpClient _client;

        public GetSchedeContattoByCodiciFiscali(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoFromCodiciFiscali(List<string> codiciFiscali)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByCF/codiciFiscali={0}", codiciFiscali));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
