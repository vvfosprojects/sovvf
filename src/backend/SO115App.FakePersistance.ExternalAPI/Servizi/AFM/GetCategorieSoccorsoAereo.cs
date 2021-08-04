using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetCategorieSoccorsoAereo : IGetCategorieSoccorsoAereo
    {
        private readonly IHttpRequestManager<List<CategoriaAFM>> _client;
        private readonly IConfiguration _config;
        public GetCategorieSoccorsoAereo(IHttpRequestManager<List<CategoriaAFM>> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public List<CategoriaAFM> Get()
        {
            //_client.SetCache();

            var result = _client.GetAsync(new Uri(_config.GetSection("UrlExternalApi").GetSection("AFM").Value + "rescueCategory"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
