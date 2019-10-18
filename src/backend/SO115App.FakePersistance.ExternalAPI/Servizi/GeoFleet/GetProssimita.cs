using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    public class GetProssimita : IGetProssimita
    {
        private HttpClient _client;

        public GetProssimita(HttpClient client)
        {
            _client = client;
        }

        public List<ProssimitaMezzo> Get(float lat, float lon, float maxRadius, List<string> classiMezzo, int attSec)
        {
            var response = _client.GetAsync($"{Costanti.GeoFleetGetProssimita}?lat={lat}&lon={lon}&distanzaMaxMt={maxRadius}&classiMezzo={classiMezzo}&attsec{attSec}").ToString();
            return JsonConvert.DeserializeObject<List<ProssimitaMezzo>>(response);
        }
    }
}
