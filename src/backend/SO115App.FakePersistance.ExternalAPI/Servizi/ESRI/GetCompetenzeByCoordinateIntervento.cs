using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class GetCompetenzeByCoordinateIntervento : IGetCompetenzeByCoordinateIntervento
    {
        private readonly IHttpRequestManager<ESRI_IdCompetenze> _jobIdClient;
        private readonly IHttpRequestManager<ESRI_Competenze> _competenzeClient;
        private readonly IGetToken_ESRI _getToken_ESRI;
        private readonly IConfiguration _configuration;

        public GetCompetenzeByCoordinateIntervento(IHttpRequestManager<ESRI_IdCompetenze> jobIdClient,
                                                   IHttpRequestManager<ESRI_Competenze> competenzeClient,
                                                   IGetToken_ESRI getToken_ESRI,
                                                   IConfiguration configuration)
        {
            _jobIdClient = jobIdClient;
            _competenzeClient = competenzeClient;
            _getToken_ESRI = getToken_ESRI;
            _configuration = configuration;
        }

        string[] IGetCompetenzeByCoordinateIntervento.GetCompetenzeByCoordinateIntervento(Coordinate coordinate)
        {
            string[] competenze = new string[3];
            string token = _getToken_ESRI.Get();

            var coord = new ESRI_CompetenzeRequest()
            {
                x = coordinate.Longitudine,
                y = coordinate.Latitudine
            };

            Dictionary<string, string> postData = new Dictionary<string, string>();
            postData.Add("point", JsonConvert.SerializeObject(coord));
            postData.Add("token", token);
            postData.Add("f", "json");

            var multipartFormDataContent = new MultipartFormDataContent();

            foreach (var keyValuePair in postData)
            {
                multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
                    String.Format("\"{0}\"", keyValuePair.Key));
            }

            var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/submitJob");

            var jobIdResponse = _jobIdClient.PostAsyncFormData(url, multipartFormDataContent).Result;

            Stopwatch stopwatch = Stopwatch.StartNew();
            while (true)
            {
                //some other processing to do possible
                if (stopwatch.ElapsedMilliseconds >= 5000)
                {
                    break;
                }
            }

            if (jobIdResponse != null)
            {
                var urlCodCom = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/Jobs/{jobIdResponse.jobId}/results/cod_com?f=json&token={token}");
                var CodComResponse = _competenzeClient.GetAsync(urlCodCom).Result;

                var urlComp1 = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/Jobs/{jobIdResponse.jobId}/results/rank_1?f=json&token={token}");
                var Comp1Response = _competenzeClient.GetAsync(urlComp1).Result;

                if (Comp1Response != null)
                    competenze[0] = $"{CodComResponse.value}.{Comp1Response.value}";

                var urlComp2 = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/Jobs/{jobIdResponse.jobId}/results/rank_2?f=json&token={token}");
                var Comp2Response = _competenzeClient.GetAsync(urlComp2).Result;

                if (Comp2Response != null)
                    competenze[1] = $"{CodComResponse.value}.{Comp2Response.value}";

                var urlComp3 = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/Jobs/{jobIdResponse.jobId}/results/rank_3?f=json&token={token}");
                var Comp3Response = _competenzeClient.GetAsync(urlComp3).Result;

                if (Comp3Response != null)
                    competenze[2] = $"{CodComResponse.value}.{Comp3Response.value}";
            }

            return competenze;
        }
    }
}
