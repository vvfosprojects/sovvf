using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoTimeSpan : IGetSchedeContattoTimeSpan
    {
        private readonly HttpClient _client;

        public GetSchedeContattoTimeSpan(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByTimeSpan/dataDa={0}&dataDa={1}", dataDa, dataA));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
