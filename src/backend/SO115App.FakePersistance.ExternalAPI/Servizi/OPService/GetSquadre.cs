using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetSquadre : IGetSquadre
    {
        private readonly IHttpRequestManager<List<Squadra>> _service;
        private readonly IConfiguration _config;
        public GetSquadre(IHttpRequestManager<List<Squadra>> service, 
            IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        public async Task<List<Squadra>> GetByCodiceDistaccamento(string Codice)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);
            var url = new Uri(baseurl, "api/v1/so-workshift/current" + "?id_sede=" + Codice);

            var result = _service.GetAsync(url, "");

            return await result;
        }
    }
}