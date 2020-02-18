using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.CompetenzeMapper
{
    public class GetCompetenzeByNomeVia : IGetCompetenzeRichiesta
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetCompetenzeByNomeVia(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<CompetenzeRichiesta> GetCompetenzeRichiesta(string CodSede, string NomeVia, string Civico)
        {
            return CallOra(CodSede, NomeVia, Civico).Result;
        }

        private async Task<List<CompetenzeRichiesta>> CallOra(string CodSede, string NomeVia, string Civico)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var responseElenco = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPICompetenze").Value}GetCompetenzeByNomeVia?CodSede={CodSede}&NomeVia={NomeVia}&Civico={Civico}").ConfigureAwait(false);

            responseElenco.EnsureSuccessStatusCode();
            using HttpContent content = responseElenco.Content;

            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var ElencoCompetenze = JsonConvert.DeserializeObject<List<ORACompetenzeByNomeVia>>(data);

            return MapOraInMongo(ElencoCompetenze);
        }

        private List<CompetenzeRichiesta> MapOraInMongo(List<ORACompetenzeByNomeVia> elencoCompetenze)
        {
            List<CompetenzeRichiesta> ListaCompetenze = new List<CompetenzeRichiesta>();

            foreach (ORACompetenzeByNomeVia oraCompetenza in elencoCompetenze)
            {
                CompetenzeRichiesta competenza = new CompetenzeRichiesta()
                {
                    CodDistaccamento = Convert.ToInt32(oraCompetenza.COD_DISTACCAMENTO1),
                    CodDistaccamento2 = Convert.ToInt32(oraCompetenza.COD_DISTACCAMENTO2),
                    CodDistaccamento3 = Convert.ToInt32(oraCompetenza.COD_DISTACCAMENTO3),
                    DescDistaccamento = oraCompetenza.DESC_DISTACCAMENTO1,
                    DescDistaccamento2 = oraCompetenza.DESC_DISTACCAMENTO2,
                    DescDistaccamento3 = oraCompetenza.DESC_DISTACCAMENTO3,
                    CodZona = oraCompetenza.ID_ZONA,
                    flag_attivo = "1"
                };

                ListaCompetenze.Add(competenza);
            }

            return ListaCompetenze;
        }
    }
}
