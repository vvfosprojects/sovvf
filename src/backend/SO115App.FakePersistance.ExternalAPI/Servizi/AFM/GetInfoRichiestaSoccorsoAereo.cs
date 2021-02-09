using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetInfoRichiestaSoccorsoAereo : IGetInfoRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<InfoAFM> _client;
        public GetInfoRichiestaSoccorsoAereo(IHttpRequestManager<InfoAFM> client) => _client = client;

        public InfoAFM Get(string requestKey)
        {
            _client.Configure();

            var result = _client.GetAsync(new Uri(Costanti.AFM + "rescueRequest/" + requestKey + "/"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
