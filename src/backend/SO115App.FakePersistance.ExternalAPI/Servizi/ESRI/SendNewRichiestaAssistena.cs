using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class SendNewRichiestaAssistena : INotify_ESRIAddRichiesta
    {
        private readonly IHttpRequestManager<ESRI_ResponseMessage> _client;
        private readonly IConfiguration _configuration;
        private readonly IGetToken_ESRI _getToken_ESRI;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;

        public SendNewRichiestaAssistena(IHttpRequestManager<ESRI_ResponseMessage> client,
                                         IConfiguration configuration,
                                         IGetToken_ESRI getToken_ESRI,
                                         IUpDateRichiestaAssistenza upDateRichiestaAssistenza)
        {
            _client = client;
            _configuration = configuration;
            _getToken_ESRI = getToken_ESRI;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
        }

        public void Call(ESRI_RichiestaMessage message, RichiestaAssistenza richiesta)
        {
            //var content = new StringContent(jsonString);

            List<ESRI_RichiestaMessage> listaMsg = new List<ESRI_RichiestaMessage>();
            listaMsg.Add(message);
            var jsonString = JsonConvert.SerializeObject(listaMsg);

            Dictionary<string, string> postData = new Dictionary<string, string>();
            postData.Add("features", jsonString);
            postData.Add("f", "json");
            postData.Add("token", _getToken_ESRI.Get());

            var multipartFormDataContent = new MultipartFormDataContent();

            foreach (var keyValuePair in postData)
            {
                multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
                    String.Format("\"{0}\"", keyValuePair.Key));
            }

            var uri = new Uri(_configuration.GetSection("ESRI").GetSection("URLRichieste").Value + "/addFeatures");

            //var result = _client.PostAsyncFormData(uri, multipartFormDataContent).Result;

            //if (result != null && result.addResults[0].success == false)
            //{
            //    throw new Exception($"Errore servizio ESRI: {result.addResults[0].error.description}");
            //}
            //else
            //{
            //    richiesta.Esri_Param = new API.Models.Classi.Soccorso.ESRI()
            //    {
            //        ObjectId = result.addResults[0].objectId,
            //        LastUpdate = DateTime.Now
            //    };

            //    _upDateRichiestaAssistenza.UpDate(richiesta);
            //}
        }
    }
}
