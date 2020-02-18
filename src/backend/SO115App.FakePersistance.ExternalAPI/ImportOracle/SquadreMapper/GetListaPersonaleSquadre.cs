using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using static SO115App.API.Models.Classi.Condivise.Squadra;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetListaPersonaleSquadre
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaPersonaleSquadre(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<ORAPersonaleSquadre>> Get(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaPersonaleSquadre?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            return await content.ReadAsAsync<List<ORAPersonaleSquadre>>().ConfigureAwait(false);
        }
    }
}
