using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class GetDistanzaTempoMezzi : IGetDistanzaTempoMezzi
    {
        private readonly IHttpRequestManager<ESRI_DistanzaTempoMezzoResponse> _client;
        private readonly IGetToken_ESRI _getToken;
        private readonly IConfiguration _config;
        public GetDistanzaTempoMezzi(IHttpRequestManager<ESRI_DistanzaTempoMezzoResponse> client, IGetToken_ESRI getToken, IConfiguration config)
        {
            _client = client;
            _config = config;
            _getToken = getToken;
        }

        public async Task<ESRI_DistanzaTempoMezzoResponse> Get(ESRI_DistanzaTempoMezzi obj)
        {
            var token = _getToken.Get();

            try
            {
                var stringContent = new StringContent(JsonConvert.SerializeObject(obj));

                var uri = new Uri($"{_config.GetSection("ESRI").GetSection("URLDistanzaTempoMezzo").Value}");

                var result = await _client.PostAsync(uri, stringContent, token);

                return result;
            }
            catch (Exception e)
            {
                //return new ESRI_DistanzaTempoMezzoResponse()
                //{
                //    ArrayMezzi = obj.Mezzi.Select(m => new ESRI_MezzoResponse()
                //    {
                //        codice = m.codiceMezzo,
                //        distanza = "41.200",
                //        tempo = "12.9"
                //    }).ToList()
                //};

                throw new Exception("Errore servizio ESRI (distanza e tempo mezzi).");
            }
        }
    }
}
