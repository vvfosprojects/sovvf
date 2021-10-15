using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

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
            //string token = "";

            //Dictionary<string, string> postData = new Dictionary<string, string>();
            //postData.Add("username", _configuration.GetSection("ESRI").GetSection("User").Value);
            //postData.Add("password", _configuration.GetSection("ESRI").GetSection("Password").Value);
            //postData.Add("referer", _configuration.GetSection("ESRI").GetSection("URLRichieste").Value);
            //postData.Add("f", "json");

            //var multipartFormDataContent = new MultipartFormDataContent();

            //foreach (var keyValuePair in postData)
            //{
            //    multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
            //        String.Format("\"{0}\"", keyValuePair.Key));
            //}

            ////using HttpContent formContent = new FormUrlEncodedContent(postData);
            ////var content = new MultipartFormDataContent();
            ////content.Add(formContent);

            //var url = new Uri($"{_configuration.GetSection("ESRI").GetSection("URLToken").Value}");

            //var EsitoToken = _clientToken.PostAsyncFormData(url, multipartFormDataContent).Result;

            //if (EsitoToken.token != null)
            //    token = EsitoToken.token;

            //return token;
            return "";
        }
    }
}
