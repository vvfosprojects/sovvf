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
            var ListaPersonaleVVF = GetPersonaleVVFExternalAPI(codSede).Result;

            return ListaPersonaleVVF.Find(x => x.CodFiscale.Equals(codiceFiscale));
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPI(string codSede)
        {
            List<PersonaleVVF> listaPersonale = new List<PersonaleVVF>();

            if (!_memoryCache.TryGetValue($"Personale_{codSede.Split('.')[0]}", out listaPersonale))
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciSede={codSede.Split('.')[0]}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);

                listaPersonale = MapPersonaleVVFsuPersonaleUC.Map(personaleUC);

                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                _memoryCache.Set($"Personale_{codSede.Split('.')[0]}", listaPersonale, cacheEntryOptions);

                return listaPersonale;
            }
            else
            {
                return listaPersonale;
            }
        }
    }
}
