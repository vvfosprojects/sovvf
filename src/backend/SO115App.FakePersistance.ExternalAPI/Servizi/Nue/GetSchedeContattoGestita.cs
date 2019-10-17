using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoGestita : IGetSchedeContattoGestita
    {
        private readonly HttpClient _client;

        public GetSchedeContattoGestita(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoGestita(bool gestita)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetGestite/gestita={0}", gestita));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
