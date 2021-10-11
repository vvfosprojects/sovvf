using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
        private readonly IHttpRequestManager<List<ESRI_ResposeMessage>> _client;
        private readonly IConfiguration _configuration;
        private readonly IGetToken_ESRI _getToken_ESRI;

        public SendNewRichiestaAssistena(IHttpRequestManager<List<ESRI_ResposeMessage>> client,
                                         IConfiguration configuration,
                                         IGetToken_ESRI getToken_ESRI)
        {
            _client = client;
            _configuration = configuration;
            _getToken_ESRI = getToken_ESRI;
        }

        public void Call(ESRI_RichiestaMessage message)
        {
            var jsonString = JsonConvert.SerializeObject(message);
            var content = new StringContent(jsonString);

            var uri = new Uri(_configuration.GetSection("ESRI").GetSection("URLRichieste").Value);

            var result = _client.PutAsync(uri, content, _getToken_ESRI.Get()).Result;

            if (result != null && result[0].AddResults[0].Success != false)
            {
                throw new Exception($"Errore servizio ESRI: {result[0].AddResults[0].Error.Description}");
            }
        }
    }
}
