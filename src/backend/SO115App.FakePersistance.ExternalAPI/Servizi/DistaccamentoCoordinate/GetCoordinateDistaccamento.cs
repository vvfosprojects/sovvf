using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.DistaccamentoCoordinate
{
    /// <summary>
    ///   classe che recupera le coordinate da un servizio fake
    /// </summary>
    public class GetCoordinateDistaccamento : IGetCoordinateDistaccamento
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetCoordinateDistaccamento(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        /// <summary>
        ///   metodo che si occupa del reperimento
        /// </summary>
        /// <param name="codSede">il codice sede del distaccamento</param>
        /// <returns>Un task contenente le coordinate del distaccamento</returns>
        public async Task<Coordinate> Get(string codSede)
        {
            var response = await _client.GetAsync($"{_configuration.GetSection("DataFakeImplementation").GetSection("UrlAPISedi").Value}/GetCoordinateByCodSede?CodSede={codSede}").ConfigureAwait(false);
            if (response.StatusCode != System.Net.HttpStatusCode.OK) return null;
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            return JsonConvert.DeserializeObject<Coordinate>(data);
        }
    }
}
