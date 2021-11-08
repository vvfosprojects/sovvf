using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetTipologieSoccorsoAereo : IGetTipologieRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<List<TipologiaAFM>> _client;
        private readonly IConfiguration _config;

        public GetTipologieSoccorsoAereo(IHttpRequestManager<List<TipologiaAFM>> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public List<TipologiaAFM> Get()
        {
            var result = _client.GetAsync(new Uri(_config.GetSection("AFM").GetSection("URL").Value + "requestType"), _config.GetSection("AFM").GetSection("user").Value, _config.GetSection("AFM").GetSection("password").Value).Result;

            return result;
        }
    }
}
