using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetCategorieSoccorsoAereo : IGetCategorieSoccorsoAereo
    {
        private readonly IHttpRequestManager<List<CategoriaAFM>> _client;
        public GetCategorieSoccorsoAereo(IHttpRequestManager<List<CategoriaAFM>> client) => _client = client;

        public List<CategoriaAFM> Get()
        {
            _client.Configure();

            var result = _client.GetAsync(new Uri(Costanti.AFM + "rescueCategory"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
