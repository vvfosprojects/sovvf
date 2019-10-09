using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetMezziFuoriServizio : IGetMezziFuoriServizio
    {
        private readonly HttpClient _client;

        public GetMezziFuoriServizio(HttpClient client)
        {
            _client = client;
        }

        public List<Mezzo> Get(List<Sede> sedi, string genereMezzo, string siglaMezzo)
        {
            var response = _client.GetAsync($"{Costanti.GacGetMezziFuoriServizio}?sedi{sedi}&genereMezzo={genereMezzo}&siglaMezzo={siglaMezzo}").ToString();
            return JsonConvert.DeserializeObject<List<Mezzo>>(response);
        }
    }
}
