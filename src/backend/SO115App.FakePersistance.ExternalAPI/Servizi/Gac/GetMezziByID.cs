using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ApiGac.Models;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetMezziByID : IGetMezziById
    {
        private readonly HttpClient _client;

        public GetMezziByID(HttpClient client)
        {
            _client = client;
        }

        public List<MezzoDTO> Get(List<string> codiceMezzo)
        {
            var response = _client.GetAsync($"{Costanti.GacGetID}?codiciMezzo={codiceMezzo}").ToString();
            return JsonConvert.DeserializeObject<List<MezzoDTO>>(response);
        }
    }
}
