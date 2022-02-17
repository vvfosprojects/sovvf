using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class GetDistanzaTempoMezzi : IGetDistanzaTempoMezzi
    {
        private readonly IHttpRequestManager<ESRI_DistanzaTempoMezzoResponse> _client;
        private readonly IConfiguration _config;
        public GetDistanzaTempoMezzi(IHttpRequestManager<ESRI_DistanzaTempoMezzoResponse> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<ESRI_DistanzaTempoMezzoResponse> Get(ESRI_DistanzaTempoMezzi obj)
        {
            try
            {
                var uri = new Uri($"{_config.GetSection("ESRI").GetSection("URLDistanzaTempoMezzo").Value}");

                var result = await _client.PostAsync(uri);

                return result;
            }
            catch (Exception e)
            {
                return new ESRI_DistanzaTempoMezzoResponse()
                {
                    ArrayMezzi = obj.Mezzi.Select(m => new ESRI_MezzoResponse()
                    {
                        Codice = m.CodiceMezzo,
                        Km = "41.200",
                        Minuti = "12.9"
                    }).ToList()
                };

                throw new Exception("Errore servizio ESRI (distanza e tempo mezzi).");
            }
        }
    }
}
