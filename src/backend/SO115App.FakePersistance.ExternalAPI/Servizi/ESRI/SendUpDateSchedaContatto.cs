using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class SendUpDateSchedaContatto : INotifyUpDateSchedaContatto
    {
        private readonly IHttpRequestManager<ESRI_UpDateResposeMessage> _client;
        private readonly IConfiguration _configuration;
        private readonly IGetToken_ESRI _getToken_ESRI;

        public SendUpDateSchedaContatto(IHttpRequestManager<ESRI_UpDateResposeMessage> client,
                                        IConfiguration configuration,
                                        IGetToken_ESRI getToken_ESRI)
        {
            _client = client;
            _configuration = configuration;
            _getToken_ESRI = getToken_ESRI;
        }

        public void UpDate(SchedaContatto scheda)
        {
            List<ESRI_SchedaContattoMsg> listMsg = new List<ESRI_SchedaContattoMsg>();

            ESRI_SchedaContattoMsg messaggio = new ESRI_SchedaContattoMsg()
            {
                geometry = new geometrySC()
                {
                    x = scheda.Localita.Coordinate.Longitudine,
                    y = scheda.Localita.Coordinate.Latitudine,
                    spatialReference = new SpatialReference()
                    {
                        wkid = 4326
                    }
                },
                attributes = new SchedaContattoAttributes()
                {
                    objectid = scheda.esri_params.objectId,
                    categoria = scheda.Categoria,
                    classificazione = scheda.Classificazione,
                    classificazioneEvento = scheda.ClassificazioneEvento,
                    collegata = scheda.Collegata ? 1 : 0,
                    dataInserimento = scheda.DataInserimento.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds,
                    dettaglio = scheda.Dettaglio,
                    enteCompetenza = scheda.EnteCompetenza,
                    gestita = scheda.Gestita ? 1 : 0,
                    Indirizzo = scheda.Localita.Indirizzo,
                    NominativoRichiedente = scheda.Richiedente.Nominativo,
                    TelefonoRichiedente = scheda.Richiedente.Telefono,
                    priorita = scheda.Priorita
                }
            };

            listMsg.Add(messaggio);

            var jsonString = JsonConvert.SerializeObject(listMsg);

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

            var uri = new Uri(_configuration.GetSection("ESRI").GetSection("URLSchedeContatto").Value + "/updateFeatures");

            var result = _client.PostAsyncFormData(uri, multipartFormDataContent).Result;

            if (result != null && result.updateResults[0].success == false)
            {
                //DA DECIDERE COSA IMPLEMENTARE IN CASO DI ERRORE
            }
        }
    }
}
