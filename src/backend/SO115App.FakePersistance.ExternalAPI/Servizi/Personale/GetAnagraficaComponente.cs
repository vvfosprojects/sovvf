using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetAnagraficaComponente : IGetAnagraficaComponente
    {
        private readonly IHttpRequestManager<DatiComponente> _service;
        private readonly IConfiguration _config;
        public GetAnagraficaComponente(IHttpRequestManager<DatiComponente> service, IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        public async Task<DatiComponente> GetByCodFiscale(string CodFiscale)
        {
            try
            {
                _service.SetCache($"Dati_{CodFiscale}");

                var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("IdentityManagement").Value);
                var url = new Uri(baseurl, "CertificazioneAnagrafica/RecuperaAnagrafica" + "?codiceFiscale=" + CodFiscale);

                var result = _service.GetAsync(url);

                return await result;
            }
            catch (Exception e)
            {

                throw new Exception("Servizio esterno 'IdentityManagement' non disponibile");
            }
        }
    }
}
