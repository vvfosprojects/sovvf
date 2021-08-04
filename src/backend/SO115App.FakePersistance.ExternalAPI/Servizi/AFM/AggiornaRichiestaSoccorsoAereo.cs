using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class AggiornaRichiestaSoccorsoAereo : IAggiornaRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<InfoAFM> _client;
        private readonly IConfiguration _config;
        public AggiornaRichiestaSoccorsoAereo(IHttpRequestManager<InfoAFM> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public InfoAFM Aggiorna(NuovaRichiestaAFM richiesta)
        {
            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            //TODO SOSTITUIRE UTENZA
            var result = _client.PutAsync(new Uri(_config.GetSection("UrlExternalApi").GetSection("AFM").Value + "rescueRequest"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q", content).Result;

            return result;
        }
    }
}
