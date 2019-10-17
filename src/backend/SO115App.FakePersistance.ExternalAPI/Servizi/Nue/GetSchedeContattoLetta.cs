using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoLetta : IGetSchedeContattoLetta
    {
        private readonly HttpClient _client;

        public GetSchedeContattoLetta(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoLetta(bool letta)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetLette/letta={0}", letta));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
