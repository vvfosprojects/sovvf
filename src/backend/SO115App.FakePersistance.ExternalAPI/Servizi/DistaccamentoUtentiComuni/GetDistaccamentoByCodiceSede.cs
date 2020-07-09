using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DistaccamentiUtenteComune;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.DistaccamentoUtentiComuni
{
    /// <summary>
    ///   la classe che recupera il distaccamento dal servizio Utente Comune
    /// </summary>
    public class GetDistaccamentoByCodiceSede : IGetDistaccamentoByCodiceSedeUC, IGetDistaccamentoByCodiceSede
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly MapDistaccamentoSuDistaccamentoUC _mapper;
        private readonly MapSedeSuDistaccamentoUC _mapperSede;
        private readonly IMemoryCache _memoryCache;

        /// <summary>
        ///   il costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetDistaccamentoByCodiceSede(HttpClient client, IConfiguration configuration,
            MapDistaccamentoSuDistaccamentoUC mapper, MapSedeSuDistaccamentoUC mapperSede,
            IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _mapper = mapper;
            _mapperSede = mapperSede;
            _memoryCache = memoryCache;
        }

        /// <summary>
        ///   metodo della classe che restituisce un Distaccamento
        /// </summary>
        /// <param name="codiceSede"></param>
        /// <returns>un task contenente il distaccamento</returns>
        public async Task<Distaccamento> Get(string codiceSede)
        {
            var listaSedi = GetListaDistaccamentiPerComando(codiceSede.Split('.')[0]).Result;
            int res = 0;
            if (Int32.TryParse(codiceSede.Split('.')[0], out res))
                return listaSedi.Find(x => x.CodSede.Equals(codiceSede.Split('.')[0]));
            else
                return listaSedi.Find(x => x.CodSede.Equals(codiceSede));
        }

        private async Task<List<Distaccamento>> GetListaDistaccamentiPerComando(string CodComando)
        {
            List<Distaccamento> listaDistaccamenti = new List<Distaccamento>();

            if (!_memoryCache.TryGetValue($"Distaccamenti_{CodComando}", out listaDistaccamenti))
            {
                List<Distaccamento> listaDistaccamentiAppo = new List<Distaccamento>();
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var responsePadre = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("InfoSedeApiUtenteComune").Value}/GetInfoSede?codSede={CodComando}").ConfigureAwait(false);
                responsePadre.EnsureSuccessStatusCode();
                using HttpContent contentPadre = responsePadre.Content;
                string dataPadre = await contentPadre.ReadAsStringAsync().ConfigureAwait(false);
                var DistaccametoUCPadre = JsonConvert.DeserializeObject<DistaccamentoUC>(dataPadre);

                if (DistaccametoUCPadre != null)
                {
                    Distaccamento distaccamento = new Distaccamento();
                    if (DistaccametoUCPadre.CodDistaccamento.Equals("0"))
                        DistaccametoUCPadre.CodDistaccamento = "1000";
                    distaccamento = _mapper.Map(DistaccametoUCPadre);
                    listaDistaccamentiAppo.Add(distaccamento);
                }

                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("InfoSedeApiUtenteComune").Value}/GetChildSede?codSede={CodComando}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                var ListaDistaccametiUC = JsonConvert.DeserializeObject<List<DistaccamentoUC>>(data);

                foreach (var dist in ListaDistaccametiUC)
                {
                    Distaccamento distaccamento = new Distaccamento();
                    if (dist.CodDistaccamento.Equals("0"))
                        dist.CodDistaccamento = "1000";

                    distaccamento = _mapper.Map(dist);
                    listaDistaccamentiAppo.Add(distaccamento);
                }

                listaDistaccamenti = listaDistaccamentiAppo;
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                _memoryCache.Set($"Distaccamenti_{CodComando}", listaDistaccamenti, cacheEntryOptions);

                return listaDistaccamenti;
            }
            else
            {
                return listaDistaccamenti;
            }

            throw new NotImplementedException();
        }

        Sede IGetDistaccamentoByCodiceSede.Get(string codiceSede)
        {
            var distaccamento = this.Get(codiceSede).Result;
            return _mapperSede.Map(distaccamento);
        }
    }
}
