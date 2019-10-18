using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetMovimentazione : ISetMovimentazione
    {
        private readonly HttpClient _client;

        public SetMovimentazione(HttpClient client)
        {
            _client = client;
        }

        public void Set(string codiceMezzo, string idRichiesta, string statoOperativo, string timeStamp)
        {
            var stringContent = new FormUrlEncodedContent(new[]
                                {
                                    new KeyValuePair<string, string>("codiceMezzo", codiceMezzo),
                                    new KeyValuePair<string, string>("idRichiesta", idRichiesta),
                                    new KeyValuePair<string, string>("statoOperativo", statoOperativo),
                                    new KeyValuePair<string, string>("timeStamp", timeStamp),
                                });
            _client.PutAsync($"{Costanti.GacPutMovimentazione}", stringContent);
        }
    }
}
