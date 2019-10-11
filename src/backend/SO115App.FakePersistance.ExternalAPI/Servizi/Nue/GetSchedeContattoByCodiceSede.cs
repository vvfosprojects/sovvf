using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoByCodiceSede : IGetSchedeContattoByCodiceSede
    {
        private HttpClient client = new HttpClient();

        public List<SchedaContatto> SchedeContattoFromCodiceSede(string codice)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByCodiceSede/codice={0}", codice));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
            return listaSchede;
        }
    }
}
