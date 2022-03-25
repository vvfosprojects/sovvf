using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF;
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
        private readonly IHttpRequestManager<List<AnagraficaPersonaleVVF>> _clientAnagrafica;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetPersonaleVVF(IHttpRequestManager<List<PersonaleUC>> client,
                               IConfiguration configuration,
                               IHttpRequestManager<List<AnagraficaPersonaleVVF>> clientAnagrafica)
        {
            _client = client;
            _configuration = configuration;
            _clientAnagrafica = clientAnagrafica;
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
                    var result = _client.GetAsync(uri).Result;

                    result.ForEach(p => personaleUC.Enqueue(p));
                });
            }
            catch (Exception e)
            {
                throw new Exception("Servizio Utenti Comuni non disponibile.");
            }

            var listaFiltrata = personaleUC.ToList()
                .FindAll(x => lstSegmenti.Contains(x.cognome.ToLower()) && lstSegmenti.Contains(x.nome.ToLower()))
                .Map()
                .OrderBy(x => x.cognome)
                .Distinct()
                .ToList();

            return listaFiltrata;
        }

        public List<PersonaleVVF> Get(PersonaleVVFQuery query, string codSede = null)
        {
            //Gestisco la searchkey
            string parametriNominativo = "";
            if (query.Nome != null)
                parametriNominativo = $"Nome={query.Nome}&Cognome={query.Cognome}";

            string paramCodiceFiscale = "";
            if (query.CodiceFiscale!=null)
                paramCodiceFiscale = $"&codiciFiscali={query.CodiceFiscale}";

            var stringaGet = parametriNominativo + paramCodiceFiscale;

            var personaleUC = new ConcurrentQueue<PersonaleUC>();

            //Reperisco i dati
            try
            {
                var uri = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?{stringaGet}");
                var result = _client.GetAsync(uri).Result;

                result.ForEach(p => personaleUC.Enqueue(p));
            }
            catch (Exception e)
            {
                throw new Exception("Servizio Utente Comuni non disponibile.");
            }

            //Applico i filtri sui dati

            var listaFiltrata = personaleUC.ToList()
                .Map()
                .OrderBy(x => x.cognome)
                .Distinct()
                .ToList();

            return listaFiltrata;
        }

        public List<AnagraficaPersonaleVVF> GetAnagraficaPersonale(string[] codSede)
        {
            try
            {
                _client.SetCache($"PersonaleApiUtenteComuni_{String.Join(",", codSede)}");

                var uri = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiAnagraficaUtenti").Value}?codiciSede={String.Join(",", codSede)}");
                var result = _clientAnagrafica.GetAsync(uri).Result;

                return result;
            }
            catch (Exception e)
            {
                throw new Exception("Servizio anagrafica utenti non disponibile.");
            }
        }

        public List<PersonaleVVF> GetByCodiceSede(string[] codSede)
        {
            var personaleUC = new ConcurrentQueue<PersonaleUC>();

            //Reperisco i dati
            try
            {
                _client.SetCache($"PersonaleApiUtenteComuni_{String.Join(",", codSede)}");

                var uri = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciSede={String.Join(",", codSede)}");
                var result = _client.GetAsync(uri).Result;

                result.ForEach(p => personaleUC.Enqueue(p));
            }
            catch (Exception e)
            {
                throw new Exception("Servizio Utente Comuni non disponibile.");
            }

            var listaFiltrata = personaleUC.ToList()
                .Map()
                .OrderBy(x => x.cognome)
                .Distinct()
                .ToList();

            return listaFiltrata;
        }
    }
}
