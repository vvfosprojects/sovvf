using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Tipologie;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.TipologieMapper
{
    public class GetTipologie : IGetListaTipologie
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetTipologie(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public List<Tipologia> ListaTipologie(string CodSede)
        {
            List<Tipologia> ListaTipologie = new List<Tipologia>();

            if (!_memoryCache.TryGetValue("ListaTipologie", out ListaTipologie))
            {
                ListaTipologie = GetListaTipologie(CodSede).Result;
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(2));
                _memoryCache.Set("ListaTipologie", ListaTipologie, cacheEntryOptions);
            }

            return ListaTipologie;
        }

        public async Task<List<Tipologia>> GetListaTipologie(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPITipologie").Value}GetListaTipologie?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var ListaTipoligeOracle = JsonConvert.DeserializeObject<List<ORATipologie>>(data);

            var ListaGruppiTipologie = await GetListaGruppiTipologie(CodSede);

            return MapListaTipologieOraInMongoDB(ListaTipoligeOracle, ListaGruppiTipologie);
        }

        public async Task<List<ORAGruppo_Tipologie>> GetListaGruppiTipologie(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPITipologie").Value}GetListaGruppoTipologie?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            return JsonConvert.DeserializeObject<List<ORAGruppo_Tipologie>>(data);
        }

        private List<Tipologia> MapListaTipologieOraInMongoDB(List<ORATipologie> listaTipoligeOracle, List<ORAGruppo_Tipologie> ListaGruppiTipologie)
        {
            List<Tipologia> ListaTipologie = new List<Tipologia>();

            foreach (ORATipologie tipo in listaTipoligeOracle)
            {
                Tipologia tipologia = new Tipologia(tipo.COD_TIPOLOGIA.ToString(), tipo.DESCRIZIONE, "")
                {
                    Categoria = ListaGruppiTipologie.Find(x => x.COD_GRUPPO.Equals(tipo.COD_GRUPPO)).DESC_GRUPPO,
                    AdeguatezzaMezzo = GeneraAdeguatezzaMezzo(tipo.COD_TIPOLOGIA.ToString()),
                    Boschivo = false,
                    OppSganc = 0,
                    Star = false,
                    TipoLuogoEvento = GeneraTipoLuogoEvento(tipo.COD_TIPOLOGIA.ToString())
                };

                ListaTipologie.Add(tipologia);
            }

            return ListaTipologie;
        }

        private TipologiaLuogoEvento GeneraTipoLuogoEvento(string cOD_TIPOLOGIA)
        {
            TipologiaLuogoEvento tipoLuogo = new TipologiaLuogoEvento("0", "Abitazione");

            return tipoLuogo;
        }

        private AdeguatezzaMezzo GeneraAdeguatezzaMezzo(string cOD_TIPOLOGIA)
        {
            AdeguatezzaMezzo adeguatezza = new AdeguatezzaMezzo();
            if (!cOD_TIPOLOGIA.Equals("0") || !cOD_TIPOLOGIA.Equals("90") || !cOD_TIPOLOGIA.Equals("99"))
            {
                if (cOD_TIPOLOGIA.Equals("1") || cOD_TIPOLOGIA.Equals("4") || cOD_TIPOLOGIA.Equals("5") || cOD_TIPOLOGIA.Equals("6") || cOD_TIPOLOGIA.Equals("8") || cOD_TIPOLOGIA.Equals("9") || cOD_TIPOLOGIA.Equals("10"))
                {
                    adeguatezza.Ag = "0";
                    adeguatezza.Ab = "80";
                    adeguatezza.Aps = "100";
                    adeguatezza.As = "80";
                    adeguatezza.Av = "0";
                    adeguatezza.Default = "100";
                }
                else if (cOD_TIPOLOGIA.Equals("2") || cOD_TIPOLOGIA.Equals("3") || cOD_TIPOLOGIA.Equals("7"))
                {
                    adeguatezza.Ag = "50";
                    adeguatezza.Ab = "20";
                    adeguatezza.Aps = "100";
                    adeguatezza.As = "80";
                    adeguatezza.Av = "20";
                    adeguatezza.Default = "100";
                }
            }
            else
            {
                adeguatezza.Ag = "0";
                adeguatezza.Ab = "0";
                adeguatezza.Aps = "0";
                adeguatezza.As = "0";
                adeguatezza.Av = "0";
                adeguatezza.Default = "0";
            }

            return adeguatezza;
        }
    }
}
