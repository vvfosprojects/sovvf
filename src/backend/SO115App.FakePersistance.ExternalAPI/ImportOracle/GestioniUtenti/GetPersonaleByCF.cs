using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti
{
    /// <summary>
    ///   classe che si occupa del recupero del personale da Oracle
    /// </summary>
    public class GetPersonaleByCF : IGetPersonaleByCF
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetPersonaleByCF(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        /// <summary>
        ///   metodo della classe che restituisce una persona fisica
        /// </summary>
        /// <param name="codiceFiscale">codice fiscale della persona</param>
        /// <param name="codSede">codice sede di riferimento</param>
        /// <returns>PersonaleVVF</returns>
        public async Task<PersonaleVVF> Get(string codiceFiscale, string codSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede).GetSection("UrlAPIGestioneUtente").Value}/GetPersonaleByCF?codiceFiscale={codiceFiscale}&codiceSede={codSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var oraPersonale = JsonConvert.DeserializeObject<ORAPersonaleVVF>(data);
            return MapORAPersonaleSuPersonaleVVF.Map(oraPersonale);
        }
    }
}
