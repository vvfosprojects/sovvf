using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetHistoryRichiestaSoccorsoAereo : IGetHistoryRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<StoricoAFM> _client;
        private readonly IConfiguration _config;

        public GetHistoryRichiestaSoccorsoAereo(IHttpRequestManager<StoricoAFM> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public StoricoAFM Get(string requestKey)
        {
            var result = _client.GetAsync(new Uri(_config.GetSection("UrlExternalApi").GetSection("AFM").Value + "rescueRequest/" + requestKey + "/history"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
