using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DistaccamentiUtenteComune;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.DistaccamentoUtentiComuni
{
    /// <summary>
    ///   la classe che recupera il distaccamento dal servizio Utente Comune
    /// </summary>
    public class GetDistaccamentoByCodiceSede : IGetDistaccamentoByCodiceSedeUC
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly MapDistaccamentoSuDistaccamentoUC _mapper;

        /// <summary>
        ///   il costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetDistaccamentoByCodiceSede(HttpClient client, IConfiguration configuration, MapDistaccamentoSuDistaccamentoUC mapper)
        {
            _client = client;
            _configuration = configuration;
            _mapper = mapper;
        }

        /// <summary>
        ///   metodo della classe che restituisce un Distaccamento
        /// </summary>
        /// <param name="codiceSede"></param>
        /// <returns>un task contenente il distaccamento</returns>
        public async Task<Distaccamento> Get(string codiceSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("InfoSedeApiUtenteComune").Value}/GetInfoSede?codSede={codiceSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var personaleUC = JsonConvert.DeserializeObject<DistaccamentoUC>(data);
            return _mapper.Map(personaleUC);
        }
    }
}
