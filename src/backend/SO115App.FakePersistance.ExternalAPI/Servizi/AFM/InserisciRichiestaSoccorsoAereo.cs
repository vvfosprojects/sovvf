using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class InserisciRichiestaSoccorsoAereo : IInserisciRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<InfoAFM> _client;
        private readonly IConfiguration _config;

        public InserisciRichiestaSoccorsoAereo(IHttpRequestManager<InfoAFM> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public void Inserisci(NuovaRichiestaAFM richiesta)
        {
            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            var result = _client.PutAsync(new Uri(_config.GetSection("AFM").GetSection("URL").Value + "rescueRequest"), _config.GetSection("AFM").GetSection("user").Value, _config.GetSection("AFM").GetSection("password").Value, content).Result;
        }
    }
}
