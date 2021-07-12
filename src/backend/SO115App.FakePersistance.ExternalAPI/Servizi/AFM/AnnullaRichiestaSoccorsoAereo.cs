using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class AnnullaRichiestaSoccorsoAereo : IAnnullaRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<InfoAFM> _client;
        public AnnullaRichiestaSoccorsoAereo(IHttpRequestManager<InfoAFM> client) => _client = client;

        public InfoAFM Annulla(AnnullaRichiestaAFM richiesta, string CodiceRichiesta)
        {
            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            //TODO SOSTOTUIRE UTENZA
            var result = _client.PostAsync(new Uri(Costanti.AFM + "rescueRequest/" + CodiceRichiesta + "/abort"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q", content).Result;

            return result;
        }
    }
}
