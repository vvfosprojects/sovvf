using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
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
        private readonly IGetToken _getToken;

        public GetCategorieSoccorsoAereo(IHttpRequestManager<List<CategoriaAFM>> client, IConfiguration config, IGetToken getToken)
        {
            _client = client;
            _config = config;
            _getToken = getToken;
        }

        public List<CategoriaAFM> Get()
        {
            string user = _config.GetSection("AFM").GetSection("user").Value;
            string password = _config.GetSection("AFM").GetSection("password").Value;

            var result = _client.GetAsync(new Uri(_config.GetSection("AFM").GetSection("URL").Value + "rescueCategory"), user, password).Result;

            return result;
        }
    }
}
