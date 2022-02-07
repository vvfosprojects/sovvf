using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetVolontari : IGetVolontari
    {
        private readonly IHttpRequestManager<Volontario> _client;
        private readonly IConfiguration _config;

        public GetVolontari(IHttpRequestManager<Volontario> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<Volontario> GetBySede(string sede)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);
            var url = new Uri(baseurl, "/api/v1/so-workshift/volunteer/current" + "?id_sede=" + sede);

            try
            {
                var result = await _client.GetAsync(url);

                return result;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
