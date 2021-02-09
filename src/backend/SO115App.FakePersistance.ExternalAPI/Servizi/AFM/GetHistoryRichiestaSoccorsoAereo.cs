using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetHistoryRichiestaSoccorsoAereo : IGetHistoryRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<StoricoAFM> _client;

        public GetHistoryRichiestaSoccorsoAereo(IHttpRequestManager<StoricoAFM> client) => _client = client;

        public StoricoAFM Get(string requestKey)
        {
            _client.Configure();

            var result = _client.GetAsync(new Uri(Costanti.AFM + "rescueRequest/" + requestKey + "/history"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
