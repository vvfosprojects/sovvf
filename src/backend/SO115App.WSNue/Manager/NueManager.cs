using Microsoft.AspNetCore.SignalR.Client;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using Newtonsoft.Json;
using SO115App.WSNue.Classi.ESRI;
using SO115App.WSNue.Classi.NUE;
using SO115App.WSNue.DataContract;
using SO115App.WSNue.Mapper;
using SO115App.WSNue.SignalR.Notifications;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml;

namespace SO115App.WSNue.Manager
{
    public class NueManager
    {
        public string InserisciSchedaNue(InsertSchedaNueRequest insertSchedaNueRequest)
        {
            var conAppo = ConfigurationManager.ConnectionStrings["MongoDbConn"].ConnectionString;
            var conDB = conAppo.Split(',')[0];
            var DbName = conAppo.Split(',')[1];

            var client = new MongoClient(conDB);
            var database = client.GetDatabase(DbName.Trim());

            try
            {
                var SchedaSO115 = MappaScheda(insertSchedaNueRequest);
                SchedaSO115.listaEventiWS = new List<Evento>()
                {
                    new Evento()
                    {
                        istante = DateTime.Now,
                        descrizione = "Ricezione scheda NUE"
                    }
                };
                database.GetCollection<SchedaContatto>("schedecontatto").InsertOne(SchedaSO115);

                SendMessageSO115WEB(SchedaSO115);
                SendMessageESRI(SchedaSO115);

                return "Ok";
            }
            catch (Exception ex)
            {
                return $"Errore servizio ESRI: {ex.Message}";
            }
        }

        private async void SendMessageESRI(SchedaContatto schedaSO115)
        {
            try
            {
                HttpClient client = new HttpClient();

                List<EsriRichiestaMsg> listaMsg = new List<EsriRichiestaMsg>()
                {
                    new EsriRichiestaMsg()
                    {
                        geometry = new geometry()
                        {
                            x = schedaSO115.localita.coordinate.longitudine,
                            y = schedaSO115.localita.coordinate.latitudine,
                            spatialReference = new SpatialReference()
                            {
                                wkid = 4326
                            }
                        },
                        attributes = new attributes()
                        {
                            categoria = "",
                            classificazione = schedaSO115.classificazione,
                            classificazioneEvento = schedaSO115.classificazioneEvento,
                            collegata = 0,
                            datainserimento = schedaSO115.dataInserimento.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds,
                            dettaglio = schedaSO115.dettaglio,
                            enteCompetenza = schedaSO115.enteCompetenza,
                            gestita = 0,
                            indirizzo = schedaSO115.localita.indirizzo,
                            nominativorichiedente = schedaSO115.richiedente.nominativo,
                            telefonorichiedente = schedaSO115.richiedente.telefono,
                            priorita = schedaSO115.priorita,
                        }
                    }
                };

                var jsonString = JsonConvert.SerializeObject(listaMsg);

                Dictionary<string, string> postData = new Dictionary<string, string>();
                postData.Add("features", jsonString);
                postData.Add("f", "json");
                postData.Add("token", GetToken());

                var multipartFormDataContent = new MultipartFormDataContent();

                foreach (var keyValuePair in postData)
                {
                    multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
                        String.Format("\"{0}\"", keyValuePair.Key));
                }

                var uri = new Uri(ConfigurationManager.ConnectionStrings["ESRIMsgConn"].ConnectionString + "/addFeatures");

                var response = await client.PostAsync(uri, multipartFormDataContent);
                var data = response.Content.ReadAsStringAsync().Result;

                var result = System.Text.Json.JsonSerializer.Deserialize<EsriRispostaMsg>(data);

                if (result != null && result.error != null)
                {
                    schedaSO115.listaEventiWS.Add(new Evento()
                    {
                        istante = DateTime.Now,
                        descrizione = $"Errore servizio ESRI:{result.error.code}/{result.error.message}"
                    });

                    UpDateRichiestaAssistenza(schedaSO115);

                    throw new Exception($"Errore servizio ESRI: {result.error.code}/{result.error.message}");
                }
                else
                {
                    schedaSO115.esri_params = new Esri_Params()
                    {
                        objectId = result.addResults[0].objectId,
                        LastUpdate = DateTime.Now
                    };

                    schedaSO115.listaEventiWS.Add(new Evento()
                    {
                        istante = DateTime.Now,
                        descrizione = "Comunicata ricezione ad ESRI"
                    });

                    UpDateRichiestaAssistenza(schedaSO115);
                }
            }
            catch (Exception e)
            {
            }
        }

        private void UpDateRichiestaAssistenza(SchedaContatto schedaSO115)
        {
            var conAppo = ConfigurationManager.ConnectionStrings["MongoDbConn"].ConnectionString;
            var conDB = conAppo.Split(',')[0];
            var DbName = conAppo.Split(',')[1];

            var client = new MongoClient(conDB);
            var database = client.GetDatabase(DbName.Trim());

            try
            {
                var filter = Builders<SchedaContatto>.Filter.Eq(s => s.Id, schedaSO115.Id);
                database.GetCollection<SchedaContatto>("schedecontatto").ReplaceOne(filter, schedaSO115);
            }
            catch (Exception e)
            {
                throw new Exception($"Errore servizio ESRI: {e.Message}");
            }
        }

        private string GetToken()
        {
            string token = "";
            try
            {
                HttpClient client = new HttpClient();

                Dictionary<string, string> postData = new Dictionary<string, string>();
                postData.Add("username", ConfigurationManager.ConnectionStrings["ESRIUser"].ConnectionString);
                postData.Add("password", ConfigurationManager.ConnectionStrings["ESRIPassword"].ConnectionString);
                postData.Add("referer", ConfigurationManager.ConnectionStrings["ESRIMsgConn"].ConnectionString);
                postData.Add("f", "json");

                var multipartFormDataContent = new MultipartFormDataContent();

                foreach (var keyValuePair in postData)
                {
                    multipartFormDataContent.Add(new StringContent(keyValuePair.Value),
                        String.Format("\"{0}\"", keyValuePair.Key));
                }

                var url = new Uri($"{ConfigurationManager.ConnectionStrings["ESRITokenMsgConn"].ConnectionString}");

                var response = client.PostAsync(url, multipartFormDataContent).Result;

                var data = response.Content.ReadAsStringAsync().Result;

                var result = System.Text.Json.JsonSerializer.Deserialize<EsriTokenMsg>(data);

                if (result != null)
                    token = result.token;
            }
            catch (Exception e)
            {
                throw new Exception($"Errore servizio ESRI: {e.Message}");
            }

            return token;
        }

        private async void SendMessageSO115WEB(SchedaContatto scheda)
        {
            try
            {
                var hubConnection = new HubConnectionBuilder()
              .WithUrl(ConfigurationManager.ConnectionStrings["SO115MsgConn"].ConnectionString)
              .Build();

                hubConnection.On<string>("ReciveServerUpdate", update =>
                {
                    //todo, adding updates tolist for example
                });

                await hubConnection.StartAsync();

                Notification<Utente> utente = new Notification<Utente>()
                {
                    CodiciSede = new string[] { scheda.codiceSede },
                    NominativoUtente = "Nue SOAP"
                };

                hubConnection.InvokeAsync("AddToGroup", utente).Wait();
                hubConnection.InvokeAsync("NotifyNewSchedaContatto", scheda).Wait();
                hubConnection.InvokeAsync("RemoveToGroup", utente).Wait();

                scheda.listaEventiWS.Add(new Evento()
                {
                    istante = DateTime.Now,
                    descrizione = $"Scheda inviata tramite SignalR ad SO115WEB"
                });

                UpDateRichiestaAssistenza(scheda);
            }
            catch (Exception e)
            {
                scheda.listaEventiWS.Add(new Evento()
                {
                    istante = DateTime.Now,
                    descrizione = $"Errore servizio SignalR: {e.InnerException.Message}"
                });

                UpDateRichiestaAssistenza(scheda);
            }
        }

        private SchedaContatto MappaScheda(InsertSchedaNueRequest scheda)
        {
            BsonClassMap.RegisterClassMap<SchedaContatto>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance)
                    .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });

            Regex regex = new Regex(@">\s*<");
            XmlDocument SchedaXml = new XmlDocument();
            XmlNamespaceManager namespaces = new XmlNamespaceManager(SchedaXml.NameTable);
            namespaces.AddNamespace("nue", "http://NUE.112.it/NUE112");
            string cleanedXml = regex.Replace(scheda.schedaContatto, "><");
            cleanedXml = cleanedXml.Replace(@"<?xml version=""1.0"" encoding=""utf-8"" ?>", "")
                         .Replace(@"<?xml version=""1.0"" encoding=""UTF-8""?>", "")
                         .Replace(@"<!DOCTYPE svc_result SYSTEM ""CENTAURO_MLP_CO_CED_SVC_RESULT_10.dtd"">", "");
            cleanedXml = @"<?xml version=""1.0"" encoding=""utf-8"" ?>" + cleanedXml;

            SchedaXml.LoadXml(cleanedXml);

            var Nome = SchedaXml.SelectSingleNode("//nue:Caller/nue:Name", namespaces).InnerText;
            var Cognome = SchedaXml.SelectSingleNode("//nue:Caller/nue:Surname", namespaces).InnerText;
            var Telefono = SchedaXml.SelectSingleNode("//nue:Caller/nue:Number", namespaces).InnerText;
            var Latitudine = SchedaXml.SelectSingleNode("//nue:MainLocation/nue:Point/nue:Latitude", namespaces).InnerText;
            var Longitudine = SchedaXml.SelectSingleNode("//nue:MainLocation/nue:Point/nue:Longitude", namespaces).InnerText;

            var indirizzo = $"{SchedaXml.SelectSingleNode("//nue:Caller/nue:Location/nue:Manual/nue:Toponymy", namespaces).InnerText} " +
                            $"{SchedaXml.SelectSingleNode("//nue:Caller/nue:Location/nue:Manual/nue:Address", namespaces).InnerText} " +
                            $"{SchedaXml.SelectSingleNode("//nue:Caller/nue:Location/nue:Manual/nue:CivicNumber", namespaces).InnerText}";

            Coordinate coordinate = new Coordinate(Convert.ToDouble(Latitudine), Convert.ToDouble(Longitudine));

            var Competenza = SchedaXml.SelectSingleNode("//nue:Companies/nue:Competence/nue:Primary/nue:Company/nue:Code", namespaces).InnerText;
            var ListaConoscenza = SchedaXml.SelectNodes("//nue:Companies/nue:ForwardedTo/nue:Company", namespaces);

            bool conoscenza = false;

            if (!Competenza.Equals(scheda.sedeDestinataria))
            {
                foreach (XmlNode nodo in ListaConoscenza)
                {
                    if (nodo.SelectSingleNode("//nue:Code", namespaces).InnerText.Equals(scheda.sedeDestinataria))
                    {
                        conoscenza = true;
                    }
                }
            }

            string classificazione = "";

            if (conoscenza)
                classificazione = "Conoscenza";
            else if (Competenza.Equals(scheda.sedeDestinataria))
                classificazione = "Competenza";
            else
                classificazione = "Deferibile";

            SchedaContatto schedaMapped = new SchedaContatto()
            {
                classificazione = classificazione,
                classificazioneEvento = SchedaXml.SelectSingleNode("//nue:Classification", namespaces).InnerText,
                codiceSede = scheda.provinciaDestinatario + ".1000",
                codiceScheda = SchedaXml.SelectSingleNode("//nue:ID", namespaces).InnerText,
                dataInserimento = Convert.ToDateTime(SchedaXml.SelectSingleNode("//nue:CreateDate", namespaces).InnerText),
                dettaglio = SchedaXml.SelectSingleNode("//nue:ClassificationDetail", namespaces).InnerText,
                enteCompetenza = SchedaXml.SelectSingleNode("//nue:CompetenceType", namespaces).InnerText,
                numeroPersoneCoinvolte = Convert.ToInt16(SchedaXml.SelectSingleNode("//nue:InvolvedNumber", namespaces).InnerText),
                priorita = Convert.ToInt16(SchedaXml.SelectSingleNode("//nue:HighPriority", namespaces).InnerText == "TRUE" ? "1" : "0"),
                richiedente = new Richiedente(Nome + " " + Cognome, Telefono),
                localita = new Localita(coordinate, indirizzo, ""),
                attributoClassificazione = SchedaXml.SelectSingleNode("//nue:ClassificationAttribute", namespaces).InnerText,
                gestita = false,
                collegata = false,
                collegate = null,
                operatoreChiamata = null,
                msgNue = scheda
            };

            return schedaMapped;
        }
    }
}