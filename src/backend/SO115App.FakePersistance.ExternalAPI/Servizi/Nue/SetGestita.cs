using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class SetGestita : ISetStatoGestioneSchedaContatto
    {
        private readonly HttpClient _client;

        public SetGestita(HttpClient client)
        {
            _client = client;
        }

        public void Gestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            var stringContent = new FormUrlEncodedContent(new[]
                                {
                                    new KeyValuePair<string, string>("codiceScheda", codiceScheda),
                                    new KeyValuePair<string, string>("codiceSede", codiceSede),
                                    new KeyValuePair<string, string>("codiceFiscale", codiceFiscale),
                                    new KeyValuePair<string, string>("gestita", gestita.ToString()),
                                });

            _client.PostAsync(Costanti.NueUrl + "/SetGestita", stringContent);
        }
    }
}
