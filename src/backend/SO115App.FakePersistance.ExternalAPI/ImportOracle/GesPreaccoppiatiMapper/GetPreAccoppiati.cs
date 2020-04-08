using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper
{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetPreAccoppiati(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public List<PreAccoppiati> Get(PreAccoppiatiQuery query)
        {
            return GetAsync(query).Result;
        }

        public async Task<List<PreAccoppiati>> GetAsync(PreAccoppiatiQuery query)
        {
            List<PreAccoppiati> ListaPreAccoppiati = new List<PreAccoppiati>();

            string CodSede = query.CodiceSede.Substring(0, 2);
            if (!_memoryCache.TryGetValue("ListaPreAccoppiati", out ListaPreAccoppiati))
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaGesPreaccoppiati?CodSede={CodSede}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                List<ORAGesPreaccoppiati> ListaPreAccoppiatiOracle = JsonConvert.DeserializeObject<List<ORAGesPreaccoppiati>>(data);
                ListaPreAccoppiati = MapListaPreAccoppiatiOraInMongoDB(ListaPreAccoppiatiOracle);
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(2));
                _memoryCache.Set("ListaPreAccoppiati", ListaPreAccoppiati, cacheEntryOptions);
            }
            return ListaPreAccoppiati;
        }

        private List<PreAccoppiati> MapListaPreAccoppiatiOraInMongoDB(List<ORAGesPreaccoppiati> ListaPreAccoppiatiOracle)
        {
            List<string> sList = new List<string>();
            var ListaPreAccoppiatigroupBy = ListaPreAccoppiatiOracle.GroupBy
                (x => new { x.COD_DISTACCAMENTO, x.COD_AUTOMEZZO, x.TIPO_MEZZO, x.TARGA_MEZZO, x.COD_COMANDO })
            .Select(y => new ORAGesPreaccoppiati()
            {
                COD_DISTACCAMENTO = y.Key.COD_DISTACCAMENTO,
                COD_COMANDO = y.Key.COD_COMANDO,
                TIPO_MEZZO = y.Key.TIPO_MEZZO,
                TARGA_MEZZO = y.Key.TARGA_MEZZO
            });

            List<PreAccoppiati> ListaPreAccoppiati = new List<PreAccoppiati>();
            foreach (ORAGesPreaccoppiati OraP in ListaPreAccoppiatigroupBy)
            {
                PreAccoppiati preAccoppiati = new PreAccoppiati
                {
                    Id = Decimal.ToInt32(OraP.COD_DISTACCAMENTO).ToString() + "-" + OraP.TIPO_MEZZO + "." + OraP.TARGA_MEZZO,
                    Mezzo = OraP.TIPO_MEZZO + "." + OraP.TARGA_MEZZO,
                    CodiceSede = OraP.COD_COMANDO + "." + Decimal.ToInt32(OraP.COD_DISTACCAMENTO).ToString()
                };

                foreach (ORAGesPreaccoppiati ORAGesPreaccoppiati in ListaPreAccoppiatiOracle)
                {
                    if (ORAGesPreaccoppiati.TARGA_MEZZO.Equals(OraP.TARGA_MEZZO))
                    {
                        sList.Add(ORAGesPreaccoppiati.COD_SQUADRA.ToString());
                    }
                }

                string[] Squadre = sList.ToArray();
                preAccoppiati.Squadre = Squadre;

                ListaPreAccoppiati.Add(preAccoppiati);
            }

            return ListaPreAccoppiati;
        }
    }
}
