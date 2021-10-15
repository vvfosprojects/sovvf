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
    public class SendUpDateRichiestaAssistenza : INotifyUpDateRichiesta
    {
        private readonly IHttpRequestManager<ESRI_UpDateResposeMessage> _client;
        private readonly IConfiguration _configuration;
        private readonly IGetToken_ESRI _getToken_ESRI;

        public SendUpDateRichiestaAssistenza(IHttpRequestManager<ESRI_UpDateResposeMessage> client,
                                             IConfiguration configuration,
                                             IGetToken_ESRI getToken_ESRI)
        {
            _client = client;
            _configuration = configuration;
            _getToken_ESRI = getToken_ESRI;
        }

        public void UpDate(ESRI_RichiestaMessage messaggio)
        {
            //List<ESRI_RichiestaMessage> listaMsg = new List<ESRI_RichiestaMessage>();
            //listaMsg.Add(messaggio);
            //var jsonString = JsonConvert.SerializeObject(listaMsg);

            //Dictionary<string, string> postData = new Dictionary<string, string>();
            //postData.Add("features", jsonString);
            //postData.Add("f", "json");
            //postData.Add("token", _getToken_ESRI.Get());

            //var multipartFormDataContent = new MultipartFormDataContent();

            //foreach (var keyValuePair in postData)
            //{
            //    multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
            //        String.Format("\"{0}\"", keyValuePair.Key));
            //}

            //var uri = new Uri(_configuration.GetSection("ESRI").GetSection("URLRichieste").Value + "/updateFeatures");

            //var result = _client.PostAsyncFormData(uri, multipartFormDataContent).Result;

            //if (result != null && result.updateResults[0].success == false)
            //    throw new Exception($"Errore servizio ESRI");
        }
    }
}
