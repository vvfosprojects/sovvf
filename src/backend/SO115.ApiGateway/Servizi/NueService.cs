using GeoCoordinatePortable;
using Newtonsoft.Json;
using SO115App.ApiGateway.Classi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115.ApiGateway.Servizi
{
    public class NueService
    {
        private HttpClient client = new HttpClient();

        public async Task<List<SchedaContatto>> GetListaSchedeContatto()
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(Costanti.NueUrl + "/GetListaSchedeContatto");
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<SchedaContatto> GetSchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            SchedaContatto Scheda = new SchedaContatto();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/SchedaContattoAttuale/codiceSede={0}&codiceOperatore={1}", codiceSede, codiceOperatore));
            Scheda = JsonConvert.DeserializeObject<SchedaContatto>(response);
            return Scheda;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoFromCodiciFiscali(List<string> codiciFiscali)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByCF/codiciFiscali={0}", codiciFiscali));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoFromCodiceSede(string codice)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByCodiceSede/codice={0}", codice));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByTimeSpan/dataDa={0}&dataDa={1}", dataDa, dataA));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoLetta(bool letta)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetLette/letta={0}", letta));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoGestita(bool gestita)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetGestite/gestita={0}", gestita));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoFromListTipo(List<string> classificazione)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByTipo/classificazione={0}", classificazione));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoFromText(string testolibero)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByText/testolibero={0}", testolibero));
            listaSchede = JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
            return listaSchede;
        }

        public async Task<List<SchedaContatto>> GetSchedeContattoBySpatialArea(double lat1, double lon1, double lat2, double lon2)
        {
            var response = await client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByArea/lat1={0},lon1={1},lat2={2},lon2={3},", lat1, lon1, lat2, lon2));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response);
        }

        public async void SetLetta(string codiceScheda, string codiceSede, string codiceFiscale, bool letta)
        {
            var stringContent = new FormUrlEncodedContent(new[]
                    {
                                    new KeyValuePair<string, string>("codiceScheda", codiceScheda),
                                    new KeyValuePair<string, string>("codiceSede", codiceSede),
                                    new KeyValuePair<string, string>("codiceFiscale", codiceFiscale),
                                    new KeyValuePair<string, string>("gestita", letta.ToString()),
                                });

            var response = await client.PostAsJsonAsync(Costanti.NueUrl + "/SetLetta", stringContent);
        }

        public async void SetGestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            var stringContent = new FormUrlEncodedContent(new[]
                                {
                                    new KeyValuePair<string, string>("codiceScheda", codiceScheda),
                                    new KeyValuePair<string, string>("codiceSede", codiceSede),
                                    new KeyValuePair<string, string>("codiceFiscale", codiceFiscale),
                                    new KeyValuePair<string, string>("gestita", gestita.ToString()),
                                });

            var response = await client.PostAsync(Costanti.NueUrl + "/SetGestita", stringContent);
        }
    }
}
