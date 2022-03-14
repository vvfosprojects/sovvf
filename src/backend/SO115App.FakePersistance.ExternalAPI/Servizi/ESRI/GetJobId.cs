using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class GetJobId : IGetJobId
    {
        private readonly IHttpRequestManager<ESRI_JobId> _client;
        private readonly IConfiguration _config;

        public GetJobId(IHttpRequestManager<ESRI_JobId> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<string> Get(string token, ESRI_DistanzaTempoMezzi obj)
        {
            try
            {
                var url = new Uri(_config.GetSection("ESRI").GetSection("URLJobId").Value.Replace("{token}", token));

                var json = JsonSerializer.Serialize(obj);

                var body = new Dictionary<string, string>()
                {
                    { "Input", json },
                    { "f", "json"}
                };

                var multipartFormDataContent = new MultipartFormDataContent();

                foreach (var keyValuePair in body)
                {
                    multipartFormDataContent.Add(new StringContent(keyValuePair.Value), string.Format("\"{0}\"", keyValuePair.Key));
                }

                var result = _client.PostAsyncFormData(url, multipartFormDataContent).Result;

                return result.jobId;
            }
            catch (Exception e)
            {
                throw new Exception("Errore servizio ESRI (GetJobId)");
            }
        }
    }
}
