using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class AggiornaRichiestaSoccorsoAereo : IAggiornaRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<InfoAFM> _client;
        public AggiornaRichiestaSoccorsoAereo(IHttpRequestManager<InfoAFM> client) => _client = client;

        public InfoAFM Aggiorna(NuovaRichiestaAFM richiesta)
        {
            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            //TODO SOSTITUIRE UTENZA
            var result = _client.PutAsync(new Uri(Costanti.AFM + "rescueRequest"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q", content).Result;

            return result;
        }
    }
}
