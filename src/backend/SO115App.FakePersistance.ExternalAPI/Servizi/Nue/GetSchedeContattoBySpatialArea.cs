using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoBySpatialArea : IGetSchedeContattoBySpatialArea
    {
        private readonly HttpClient _client;

        public GetSchedeContattoBySpatialArea(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoBySpatialArea(double lat1, double lon1, double lat2, double lon2)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByArea/lat1={0},lon1={1},lat2={2},lon2={3},", lat1, lon1, lat2, lon2));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
