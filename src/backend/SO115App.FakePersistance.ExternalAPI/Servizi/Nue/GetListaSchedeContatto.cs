using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetListaSchedeContatto : IGetSchedeContatto
    {
        private HttpClient client = new HttpClient();

        public List<SchedaContatto> ListaSchedeContatto(string codiceSede)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = client.GetStringAsync(Costanti.NueUrl + "/GetListaSchedeContatto");
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
            return listaSchede;
        }
    }
}
