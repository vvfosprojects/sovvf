using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class GetDistanzaTempoMezzi : IGetDistanzaTempoMezzi
    {
        private readonly IHttpRequestManager<ESRI_DistanzaTempoMezzoResponse> _client;
        private readonly IGetToken_ESRI _getToken;
        private readonly IConfiguration _config;
        private readonly IGetJobId _getJobId;

        public GetDistanzaTempoMezzi(IHttpRequestManager<ESRI_DistanzaTempoMezzoResponse> client, IGetToken_ESRI getToken, IGetJobId getJobId, IConfiguration config)
        {
            _client = client;
            _config = config;
            _getToken = getToken;
            _getJobId = getJobId;
        }

        public async Task<List<ESRI_MezzoResponse>> Get(ESRI_DistanzaTempoMezzi obj)
        {
            var token = _getToken.Get();

            var jobId = _getJobId.Get(token, obj);

            try
            {
                //var stringContent = new StringContent(JsonConvert.SerializeObject(obj));

                var uri = new Uri($"{_config.GetSection("ESRI").GetSection("URLDistanzaTempoMezzo").Value.Replace("{jobId}", jobId.Result).Replace("{token}", token)}");

                var result = await _client.GetAsync(uri);

                return result.lstMezzi;
            }
            catch (Exception e)
            {
                throw new Exception("Errore servizio ESRI (distanza e tempo mezzi)");
            }
        }
    }
}
