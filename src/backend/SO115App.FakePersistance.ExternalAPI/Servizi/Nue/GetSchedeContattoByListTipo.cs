using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoByListTipo : IGetSchedeContattoByTipo
    {
        private readonly HttpClient _client;

        public GetSchedeContattoByListTipo(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoFromListTipo(List<string> classificazione)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByTipo/classificazione={0}", classificazione));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
