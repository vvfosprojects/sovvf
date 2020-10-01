using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.PersonaleUtentiComuni;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    /// <summary>
    ///   classe che estende l'interfaccia e recupera la persona fisica partendo dal codice fiscale
    ///   su Utenti Comuni
    /// </summary>
    public class GetPersonaleByCF : IGetPersonaleByCF
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetPersonaleByCF(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public async Task<PersonaleVVF> Get(string codiceFiscale, string codSede = null)
        {
            if (codSede != null)
            {
                var ListaPersonaleVVF = GetPersonaleVVFExternalAPI(new string[] { codSede }).Result;
                return ListaPersonaleVVF.Find(x => x.CodFiscale.Equals(codiceFiscale));
            }
            else
            {
                var Persona = GetPersonaleVVFExternalAPIByCF(new string[] { codiceFiscale }).Result;
                return Persona.Find(x => x.CodFiscale.Equals(codiceFiscale));
            }
        }

        public async Task<List<PersonaleVVF>> Get(string[] codiceFiscale, string[] codSede = null)
        {
            if (codSede != null)
                return GetPersonaleVVFExternalAPI(codSede).Result;
            else
                return GetPersonaleVVFExternalAPIByCF(codiceFiscale).Result;
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPI(string[] codSede)
        {
            List<PersonaleVVF> listaPersonale = new List<PersonaleVVF>();

            #region API ESTERNA

            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var sede = string.Concat(codSede.Select(c => c.Split(".")[0]));
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciSede={sede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);

            #endregion

            listaPersonale = MapPersonaleVVFsuPersonaleUC.Map(personaleUC);

            //TODO GESTIONE CACHE

            //foreach (var codice in codSede)
            //{
            //    if (!_memoryCache.TryGetValue($"Personale_{codice.Split('.')[0]}", out listaPersonale))
            //    {
            //        var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
            //        _memoryCache.Set($"Personale_{codice.Split('.')[0]}", listaPersonale, cacheEntryOptions);
            //    }
            //}

            return listaPersonale;
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPIByCF(string[] CodFiscale)
        {
            var result = new List<PersonaleVVF>();

            Parallel.ForEach(CodFiscale, codf =>
            {
                #region API ESTERNA

                var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciFiscali={codf}").Result;
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                string data = content.ReadAsStringAsync().Result;
                var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);

                #endregion

                result.AddRange(MapPersonaleVVFsuPersonaleUC.Map(personaleUC)/*.Where(x => x.CodFiscale.Equals(CodFiscale)).ToList()*/);
            });

            return result;
        }
    }
}
