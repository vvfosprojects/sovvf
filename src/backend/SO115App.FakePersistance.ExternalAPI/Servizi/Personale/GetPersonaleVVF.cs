using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.PersonaleUtentiComuni;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Linq;
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

            string[] lstSegmenti = new string[6];
            if (text != null)
                lstSegmenti = text.Split(" ", StringSplitOptions.RemoveEmptyEntries);

            List<PersonaleUC> personaleUC = new List<PersonaleUC>();

            Parallel.ForEach(lstSegmenti, segmento =>
            {
                var response = _client.GetStringAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?searchKey={segmento}")
                    .ConfigureAwait(true).GetAwaiter().GetResult();

                lock (personaleUC) { personaleUC.AddRange(JsonConvert.DeserializeObject<List<PersonaleUC>>(response)); };
            });

            return MapPersonaleVVFsuPersonaleUC.Map(personaleUC.Distinct().ToList());
        }
    }
}
