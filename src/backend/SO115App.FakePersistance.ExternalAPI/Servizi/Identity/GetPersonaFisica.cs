using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Identity
{
    public class GetPersonaFisica : IGetPersonaFisica
    {
        private readonly HttpClient _client;

        public GetPersonaFisica(HttpClient client)
        {
            _client = client;
        }

        public List<PersonaFisica> Get(List<string> codiceFiscale)
        {
            var content = new KeyValuePair<string, List<string>>("codiciFiscali", codiceFiscale);
            var response = _client.PostAsJsonAsync(Costanti.PostRicercaPerElencoCodiciFiscali, content).ToString();
            return JsonConvert.DeserializeObject<List<PersonaFisica>>(response);
        }
    }
}
