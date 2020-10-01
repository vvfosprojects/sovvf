using Microsoft.Extensions.Caching.Memory;
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
            {
                return GetPersonaleVVFExternalAPI(codSede).Result;
                //return ListaPersonaleVVF.Find(x => x.CodFiscale.Equals(codiceFiscale));
            }
            else
            {
                return GetPersonaleVVFExternalAPIByCF(codiceFiscale).Result;
                //return Persona;
            }
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPI(string[] codSede)
        {
            List<PersonaleVVF> listaPersonale = new List<PersonaleVVF>();

            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var sede = string.Concat(codSede.Select(c => c.Split(".")[0]));
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciSede={sede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);

            listaPersonale = MapPersonaleVVFsuPersonaleUC.Map(personaleUC);

            foreach (var codice in codSede)
            {
                if (!_memoryCache.TryGetValue($"Personale_{codice.Split('.')[0]}", out listaPersonale))
                {
                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                    _memoryCache.Set($"Personale_{codice.Split('.')[0]}", listaPersonale, cacheEntryOptions);

                    //return listaPersonale;
                }
                //else
                //{
                //    return listaPersonale;
                //}
            }

            return listaPersonale;
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPIByCF(string[] CodFiscale)
        {
            //PersonaleVVF Persona = new PersonaleVVF();
            var stringcodici = string.Concat(CodFiscale.Select(c => '"' + c + '"' + ',' + ' '));
            var charcount = stringcodici.Count() - 2;
            var datareq = stringcodici.Substring(0, charcount);
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciFiscali={datareq}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);

            return MapPersonaleVVFsuPersonaleUC.Map(personaleUC).Where(x => x.CodFiscale.Equals(CodFiscale)).ToList();

            //return Persona;
        }
    }
}
