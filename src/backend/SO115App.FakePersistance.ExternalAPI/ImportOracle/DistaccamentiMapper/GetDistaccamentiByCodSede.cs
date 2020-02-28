using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper
{
    public class GetDistaccamentiByCodSede : IGetListaDistaccamentiByCodiceSede
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetDistaccamentiByCodSede(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public List<Distaccamento> GetListaDistaccamenti(string CodSede)
        {
            List<Distaccamento> ListaDistaccamenti = new List<Distaccamento>();

            if (!_memoryCache.TryGetValue("ListaDistaccamenti", out ListaDistaccamenti))
            {
                ListaDistaccamenti = CallOra(CodSede).Result;
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(2));
                _memoryCache.Set("ListaDistaccamenti", ListaDistaccamenti, cacheEntryOptions);
            }

            return ListaDistaccamenti;
        }

        private async Task<List<Distaccamento>> CallOra(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var responseElenco = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPIDistaccamenti").Value}GetDistaccamentiByCodiceSede?CodSede={CodSede}").ConfigureAwait(false);

            responseElenco.EnsureSuccessStatusCode();
            using HttpContent content = responseElenco.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var ElencoDistaccamenti = JsonConvert.DeserializeObject<List<ORADistaccamenti>>(data);
            return MapOraInMongo(ElencoDistaccamenti);
        }

        private List<Distaccamento> MapOraInMongo(List<ORADistaccamenti> elencoDistaccamenti)
        {
            List<Distaccamento> ListaDistaccamenti = new List<Distaccamento>();

            foreach (ORADistaccamenti OraDistaccamento in elencoDistaccamenti)
            {
                Distaccamento distaccamento = new Distaccamento()
                {
                    Cap = OraDistaccamento.CAP,
                    CodDistaccamento = OraDistaccamento.CODDISTAC,
                    CodSede = OraDistaccamento.CODSEDE,
                    DescDistaccamento = OraDistaccamento.DESCDISTAC,
                    Indirizzo = OraDistaccamento.INDIRIZZO
                };

                ListaDistaccamenti.Add(distaccamento);
            }

            return ListaDistaccamenti;
        }
    }
}
