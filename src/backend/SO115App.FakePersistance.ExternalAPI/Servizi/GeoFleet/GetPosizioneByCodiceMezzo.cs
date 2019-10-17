using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    public class GetPosizioneByCodiceMezzo : IGetPosizioneByCodiceMezzo
    {
        private HttpClient _client;

        public GetPosizioneByCodiceMezzo(HttpClient client)
        {
            _client = client;
        }

        public MessaggioPosizione Get(string codiceMezzo)
        {
            var response = _client.GetAsync($"{Costanti.GeoFleetGetPosizioneByCodiceMezzo}{codiceMezzo}").ToString(); //L'API GeoFleet ancora non si aspetta una lista di codici mezzo
            return JsonConvert.DeserializeObject<MessaggioPosizione>(response);
        }
    }
}
