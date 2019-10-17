using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoByText : IGetSchedeContattoByText
    {
        private readonly HttpClient _client;

        public GetSchedeContattoByText(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoFromText(string testolibero)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByText/testolibero={0}", testolibero));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
