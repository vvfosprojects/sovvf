﻿using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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

        string[] IGetCompetenzeByCoordinateIntervento.GetCompetenzeByCoordinateIntervento(Coordinate coordinate, String codiceSede)
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
            postData.Add("cod_sede", codiceSede);
            postData.Add("token", token);
            postData.Add("f", "json");

            var multipartFormDataContent = new MultipartFormDataContent();

            foreach (var keyValuePair in postData)
            {
                multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
                    String.Format("\"{0}\"", keyValuePair.Key));
            }

            //var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLCompetenze").Value}/execute");

            var url = new Uri("https://gis.dipvvf.it/server/rest/services/RankCompetenze/GPServer/Rank%20Competenze/execute");
                               

            var response = _getCompetenze.PostAsyncFormData(url, multipartFormDataContent).Result;

            if (response?.results != null)
            {
                var codCom = response.results.Find(x => x.paramName.Equals("cod_com")).value;

                if (!codCom.Equals("Null"))
                {
                    competenze[0] = $"{codCom}.{response.results.Find(x => x.paramName.Equals("cod_dist1")).value}";

                    if (response.results.Find(x => x.paramName.Equals("cod_dist2")) != null)
                        competenze[1] = $"{codCom}.{response.results.Find(x => x.paramName.Equals("cod_dist2")).value}";

                    if (response.results.Find(x => x.paramName.Equals("cod_dist3")) != null && Convert.ToInt32(response.results.Find(x => x.paramName.Equals("cod_dist3")).value) > 0)
                        competenze[2] = $"{codCom}.{response.results.Find(x => x.paramName.Equals("cod_dist3")).value}";
                }
            }
            else
            {
                if (response == null)
                    throw new ArgumentException($"Response == null", nameof(competenze));
                else if (response.results == null)
                    throw new ArgumentException($"Results == null", nameof(competenze));
                else
                    throw new ArgumentException($"Coordinate Errate x: {coord.x} y:{coord.y}", nameof(competenze));
            }

            return competenze.Where(c => c != null).ToArray();
        }
    }
}
