using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti
{
    public class GetPersonaleVVF : IGetPersonaleVVF
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetPersonaleVVF(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<PersonaleVVF>> Get(string text, string codSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede.Split(".")[0]).GetSection("UrlAPIGestioneUtente").Value}/GetPersonale?text={text}&codiceSede={codSede.Split(".")[0]}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var oraPersonale = JsonConvert.DeserializeObject<List<ORAPersonaleVVF>>(data);
            return MapORAPersonaleSuPersonaleVVF.MapLista(oraPersonale);
        }
    }
}
