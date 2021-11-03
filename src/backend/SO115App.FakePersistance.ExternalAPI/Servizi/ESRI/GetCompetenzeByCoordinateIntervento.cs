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
        private readonly IHttpRequestManager<ESRI_Competenze> _getCompetenze;
        private readonly IGetToken_ESRI _getToken_ESRI;
        private readonly IConfiguration _configuration;

        public GetCompetenzeByCoordinateIntervento(IHttpRequestManager<ESRI_Competenze> getCompetenze,
                                                   IGetToken_ESRI getToken_ESRI,
                                                   IConfiguration configuration)
        {
            _getCompetenze = getCompetenze;
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

            var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/execute");

            var response = _getCompetenze.PostAsyncFormData(url, multipartFormDataContent).Result;

            if (response != null)
            {
                var codCom = response.results.Find(x => x.paramName.Equals("cod_com")).value;

                competenze[0] = $"{codCom}.{response.results.Find(x => x.paramName.Equals("rank_1")).value}";

                if (response.results.Find(x => x.paramName.Equals("rank_2")) != null)
                    competenze[1] = $"{codCom}.{response.results.Find(x => x.paramName.Equals("rank_2")).value}";

                if (response.results.Find(x => x.paramName.Equals("rank_3")) != null)
                    competenze[2] = $"{codCom}.{response.results.Find(x => x.paramName.Equals("rank_3")).value}";
            }

            return competenze;
        }
    }
}
