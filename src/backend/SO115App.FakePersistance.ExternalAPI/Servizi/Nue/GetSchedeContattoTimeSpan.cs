using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoTimeSpan : IGetSchedeContattoTimeSpan
    {
        private HttpClient client = new HttpClient();

        public List<SchedaContatto> SchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByTimeSpan/dataDa={0}&dataDa={1}", dataDa, dataA));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
            return listaSchede;
        }
    }
}
