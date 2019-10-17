using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class SetLetta : ISetLetturaSchedaContatto
    {
        private readonly HttpClient _client;

        public SetLetta(HttpClient client)
        {
            _client = client;
        }

        public void Letta(string codiceSede, string codiceScheda, string codiceFiscale, bool letta)
        {
            var stringContent = new FormUrlEncodedContent(new[]
                    {
                                    new KeyValuePair<string, string>("codiceScheda", codiceScheda),
                                    new KeyValuePair<string, string>("codiceSede", codiceSede),
                                    new KeyValuePair<string, string>("codiceFiscale", codiceFiscale),
                                    new KeyValuePair<string, string>("gestita", letta.ToString()),
                                });

            _client.PostAsJsonAsync(Costanti.NueUrl + "/SetLetta", stringContent);
        }
    }
}
