using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetTipologieSoccorsoAereo : IGetTipologieRichiestaSoccorsoAereo
    {
        private readonly IHttpRequestManager<List<TipologiaAFM>> _client;
        public GetTipologieSoccorsoAereo(IHttpRequestManager<List<TipologiaAFM>> client) => _client = client;

        public List<TipologiaAFM> Get()
        {
            //_client.SetCache();

            var result = _client.GetAsync(new Uri(Costanti.AFM + "requestType"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
