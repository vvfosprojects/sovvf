using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetMezziByICCID : IGetMezziByICCID
    {
        private readonly HttpClient _client;

        public GetMezziByICCID(HttpClient client)
        {
            _client = client;
        }

        public List<Mezzo> Get(List<string> iccid)
        {
            var response = _client.GetAsync($"{Costanti.GacGetICCID}?iccid={iccid}").ToString();
            return JsonConvert.DeserializeObject<List<Mezzo>>(response);
        }
    }
}
