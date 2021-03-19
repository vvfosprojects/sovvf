using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni.Oracle;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetListaPersonaleSquadreById
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaPersonaleSquadreById(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<ORAPersonaleSquadre>> Get(string CodSede, decimal CodSquadra)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetPersonaleSquadraByCodSquadra?CodSede={CodSede}&CodSquadra={CodSquadra}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;

            string data = await content.ReadAsStringAsync().ConfigureAwait(false);

            return JsonConvert.DeserializeObject<List<ORAPersonaleSquadre>>(data);
        }
    }
}
