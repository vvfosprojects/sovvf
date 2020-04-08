using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.PersonaleUtentiComuni;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    /// <summary>
    ///   classe che implementa il servizio per il recupero del personale da Utente Comuni
    /// </summary>
    public class GetPersonaleVVF : IGetPersonaleVVF
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetPersonaleVVF(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        /// <summary>
        ///   il metodo get della classe
        /// </summary>
        /// <param name="text">la stringa per la ricerca sul nome o il cognome</param>
        /// <param name="codSede">l'eventuale codice sede</param>
        /// <returns>una lista di Personale</returns>
        public async Task<List<PersonaleVVF>> Get(string text, string codSede = null)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?searchKey={text}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);
            return MapPersonaleVVFsuPersonaleUC.Map(personaleUC);
        }
    }
}
