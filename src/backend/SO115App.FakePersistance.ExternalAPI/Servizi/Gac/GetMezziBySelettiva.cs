using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetMezziBySelettiva : IGetMezziBySelettiva
    {
        private readonly HttpClient _client;

        public GetMezziBySelettiva(HttpClient client)
        {
            _client = client;
        }

        public List<Mezzo> Get(List<string> idRadio)
        {
            var response = _client.GetAsync($"{Costanti.GacGetSELETTIVA}?idRadio={idRadio}").ToString();
            return JsonConvert.DeserializeObject<List<Mezzo>>(response);
        }
    }
}
