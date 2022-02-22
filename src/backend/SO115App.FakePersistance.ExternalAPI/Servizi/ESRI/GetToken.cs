using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
using System.Net.Http;

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

            Dictionary<string, string> postData = new Dictionary<string, string>
            {
                { "username", _configuration.GetSection("ESRI").GetSection("User").Value },
                { "password", _configuration.GetSection("ESRI").GetSection("Password").Value },
                { "referer", _configuration.GetSection("ESRI").GetSection("URLRichieste").Value },
                { "f", "json" }
            };

            var multipartFormDataContent = new MultipartFormDataContent();

            foreach (var keyValuePair in postData)
            {
                multipartFormDataContent.Add(new StringContent(keyValuePair.Value), string.Format("\"{0}\"", keyValuePair.Key));
            }

            var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLToken").Value}");

            var EsitoToken = _clientToken.PostAsyncFormData(url, multipartFormDataContent).Result;

            if (EsitoToken.token != null)
                token = EsitoToken.token;

            return token;
        }
    }
}
