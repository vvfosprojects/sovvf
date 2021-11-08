using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.DistaccamentoUtentiComuni
{
    public class GetDescComuneProvincia : IGetDescComuneProvincia
    {
        private readonly IHttpRequestManager<List<ComuneUC>> _service;
        private readonly IConfiguration _config;

        public GetDescComuneProvincia(IHttpRequestManager<List<ComuneUC>> service, IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        public async Task<List<ComuneUC>> GetComuneBy(string searchKey)
        {
            var url = new Uri("http://wauc.dipvvf.it/api/Comuni?searchKey=" + searchKey);

            var result = await _service.GetAsync(url);

            return result;
        }
    }
}
