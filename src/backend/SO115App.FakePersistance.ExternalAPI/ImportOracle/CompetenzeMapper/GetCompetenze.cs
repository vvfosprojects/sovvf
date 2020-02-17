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
    public class GetCompetenze : IGetListaCompetenze
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetCompetenze(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<Competenza> GetListaCompetenze(string codSede)
        {
            List<Competenza> ListaCompetenze = new List<Competenza>();

            //if (!_memoryCache.TryGetValue("ListaCompetenze", out ListaCompetenze))
            //{
            ListaCompetenze = CallOra(codSede).Result;
            //    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(2));
            //    _memoryCache.Set("ListaCompetenze", ListaCompetenze, cacheEntryOptions);
            //}

            return ListaCompetenze;
        }

        private async Task<List<Competenza>> CallOra(string codSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var responseElenco = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede).GetSection("UrlAPICompetenze").Value}GetListaCompetenzeElenco?CodSede={codSede}").ConfigureAwait(false);
            var responseZone = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede).GetSection("UrlAPICompetenze").Value}GetListaCompetenzeZone?CodSede={codSede}").ConfigureAwait(false);

            responseElenco.EnsureSuccessStatusCode();
            using HttpContent content = responseElenco.Content;
            var data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var listaCompetenzaElenco = JsonConvert.DeserializeObject<List<ORACompetenzeElenco>>(data);
            responseZone.EnsureSuccessStatusCode();
            using HttpContent contentZone = responseZone.Content;
            var dataZone = await content.ReadAsStringAsync().ConfigureAwait(false);
            var listaCompetenzeZone = JsonConvert.DeserializeObject<List<ORACompetenzeZone>>(dataZone);

            return MapOraInMongo(listaCompetenzaElenco, listaCompetenzeZone);
        }

        private List<Competenza> MapOraInMongo(List<ORACompetenzeElenco> elencoCompetenze, List<ORACompetenzeZone> elencoZoneCompetenze)
        {
            List<Competenza> ListaCompetenze = new List<Competenza>();

            foreach (ORACompetenzeElenco oraCompetenza in elencoCompetenze)
            {
                Competenza competenza = new Competenza();

                competenza.CodDistaccamento = Convert.ToInt32(oraCompetenza.COD_DISTACCAMENTO);
                competenza.CodZona = Convert.ToInt32(oraCompetenza.ID_ZONA);
                competenza.DescZona = elencoZoneCompetenze.Find(x => x.ID_ZONA == oraCompetenza.ID_ZONA).DESCRIZIONE;
                competenza.flag_attivo = oraCompetenza.FLG_ATTIVO.ToString();
                competenza.Ordine_Competenza = Convert.ToInt32(oraCompetenza.ORDINE_COMP);

                ListaCompetenze.Add(competenza);
            }

            return ListaCompetenze;
        }
    }
}
