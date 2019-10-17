using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContatto : IGetSchedeContatto
    {
        private readonly HttpClient _client;

        public GetSchedeContatto(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> ListaSchedeContatto(string codiceSede)
        {
            var response = _client.GetAsync($"{Costanti.NueGetSchedaContatto}?codiceSede={codiceSede}").ToString();
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
        }
    }
}
