using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti
{
    public class GetPersonaleByCodSede : IGetPersonaleByCodSede
    {
        private HttpClient _client;
        private IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetPersonaleByCodSede(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public async Task<List<PersonaleVVF>> Get(string codSede)
        {
            List<PersonaleVVF> ListaPersonale = new List<PersonaleVVF>();

            if (!_memoryCache.TryGetValue("ListaPersonale", out ListaPersonale))
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede.Split(".")[0]).GetSection("UrlAPIGestioneUtente").Value}/GetPersonaleBySede?codiceSede={codSede.Split(".")[0]}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                var oraPersonale = JsonConvert.DeserializeObject<List<ORAPersonaleVVF>>(data);
                ListaPersonale = MapORAPersonaleSuPersonaleVVF.MapLista(oraPersonale);

                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(6));
                _memoryCache.Set("ListaPersonale", ListaPersonale, cacheEntryOptions);
            }

            return ListaPersonale;
        }
    }
}
