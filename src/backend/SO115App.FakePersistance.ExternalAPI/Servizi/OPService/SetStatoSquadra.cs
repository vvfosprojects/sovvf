using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class SetStatoSquadra : ISetStatoSquadra
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;

        public SetStatoSquadra(HttpClient client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<HttpResponseMessage> SetStatoSquadraOPService(actionDTO action)
        {
            var json = JsonConvert.SerializeObject(action);
            var content = new StringContent(json);

            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);

            var url = new Uri(baseurl, "/api/v1/so-workshift/action");
            //var result = await _client.PostAsync(url, content);
            //return result;

            return null;
        }
    }
}
