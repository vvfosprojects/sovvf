using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    public class GetInRettangolo : IGetInRettangolo
    {
        private readonly HttpClient _client;

        public GetInRettangolo(HttpClient client)
        {
            client = _client;
        }

        public List<MessaggioPosizione> Get(double lat1, double lon1, double lat2, double lon2, int attSec)
        {
            var response = _client.GetAsync($"{Costanti.GeoFleetGetInRettangolo}?lat1={lat1}&lon1={lon1}&lat2={lat2}&lon2={lon2}&attsec={attSec}").ToString();

            return JsonConvert.DeserializeObject<List<MessaggioPosizione>>(response);
        }
    }
}
