using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Concurrent;
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
        private readonly IHttpRequestManager<List<PersonaleUC>> _client;
        private readonly IConfiguration _configuration;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetPersonaleVVF(IHttpRequestManager<List<PersonaleUC>> client, IConfiguration configuration)
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
            //Gestisco la searchkey
            string[] lstSegmenti = new string[6];
            if (text != null)
                lstSegmenti = text.ToLower().Split(" ", StringSplitOptions.RemoveEmptyEntries);

            var personaleUC = new ConcurrentQueue<PersonaleUC>();

            //Reperisco i dati
            try
            {
                Parallel.ForEach(lstSegmenti, segmento =>
                {
                    _client.SetCache($"PersonaleApiUtenteComuni_{segmento}");

                    var uri = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?searchKey={segmento}");
                    var result = _client.GetAsync(uri, "").Result;

                    result.ForEach(p => personaleUC.Enqueue(p));
                });
            }
            catch (Exception e)
            {
                throw new Exception("Servizio Utente Comuni non disponibile.");
            }

            //Applico i filtri sui dati
            return personaleUC.ToList()
                .FindAll(x => lstSegmenti.Contains(x.Cognome.ToLower()) || lstSegmenti.Contains(x.Nome.ToLower()))
                .Distinct()
                .OrderByDescending(x => lstSegmenti.Contains(x.Cognome.ToLower()) && lstSegmenti.Contains(x.Nome.ToLower()))
                .ToList()
                .Map();
        }
    }
}
