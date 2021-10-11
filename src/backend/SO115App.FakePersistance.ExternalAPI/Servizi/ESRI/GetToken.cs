using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
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

            var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLToken").Value}?user={_configuration.GetSection("ESRI").GetSection("User").Value}&password={_configuration.GetSection("ESRI").GetSection("Password").Value}");
            var EsitoToken = _clientToken.GetAsync(url, token).Result;

            if (EsitoToken.Token != null)
                token = EsitoToken.Token;

            return token;
        }
    }
}
