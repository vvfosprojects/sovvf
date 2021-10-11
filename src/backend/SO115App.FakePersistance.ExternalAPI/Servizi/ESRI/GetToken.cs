using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class GetToken_ESRI : IGetToken_ESRI
    {
        private readonly IHttpRequestManager<ESRI_TokenResponse> _clientToken;
        private readonly IConfiguration _configuration;

        public GetToken_ESRI(IHttpRequestManager<ESRI_TokenResponse> clientToken, IConfiguration configuration)
        {
            _clientToken = clientToken;
            _configuration = configuration;
        }

        public string Get()
        {
            string token = "";

            var request = new ESRI_TokenRequest()
            {
                F = "json",
                User = _configuration.GetSection("ESRI").GetSection("User").Value,
                Password = _configuration.GetSection("ESRI").GetSection("Password").Value,
                Referer = _configuration.GetSection("ESRI").GetSection("URLRichieste").Value
            };

            var jsonString = JsonConvert.SerializeObject(request);
            var content = new StringContent(jsonString);

            var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLToken").Value}");

            var EsitoToken = _clientToken.PostAsync(url, content).Result;

            if (EsitoToken.Token != null)
                token = EsitoToken.Token;

            return token;
        }
    }
}
