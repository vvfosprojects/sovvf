﻿using Microsoft.AspNetCore.SignalR.Client;
using MongoDB.Bson;
using MongoDB.Driver;
using SO115App.WSNue.Classi.NUE;
using SO115App.WSNue.DataContract;
using SO115App.WSNue.Mapper;
using SO115App.WSNue.SignalR.Notifications;
using System;
using System.Configuration;
using System.Linq;
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

                var colCheck = database.ListCollections(new ListCollectionsOptions { Filter = new BsonDocument("name", "schedeNue") }).ToList();
                if (colCheck.Count > 0)
                    database.GetCollection<InsertSchedaNueRequest>("schedeNue").InsertOne(insertSchedaNueRequest);
                else
                {
                    database.CreateCollection("schedeNue");
                    database.GetCollection<InsertSchedaNueRequest>("schedeNue").InsertOne(insertSchedaNueRequest);
                }

                database.GetCollection<SchedaContatto>("schedecontatto").InsertOne(MappaWSsuSchedaContatto.MappaSchedaContatto(insertSchedaNueRequest));

                SendMessage(SchedaSO115);

                return "Ok";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private async void SendMessage(SchedaContatto scheda)
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

            hubConnection.InvokeAsync("NotifyUpdateSchedaContatto", scheda).Wait();

            hubConnection.InvokeAsync("RemoveToGroup", utente).Wait();
        }

        private SchedaContatto MappaScheda(InsertSchedaNueRequest scheda)
        {
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
                id = "",
                numeroPersoneCoinvolte = Convert.ToInt16(SchedaXml.SelectSingleNode("//nue:InvolvedNumber", namespaces).InnerText),
                priorita = Convert.ToInt16(SchedaXml.SelectSingleNode("//nue:HighPriority", namespaces).InnerText == "TRUE" ? "1" : "0"),
                richiedente = new Richiedente(Nome + " " + Cognome, Telefono),
                localita = new Localita(coordinate, "", ""),
                attributoClassificazione = SchedaXml.SelectSingleNode("//nue:ClassificationAttribute", namespaces).InnerText,
            };

            return schedaMapped;
        }
    }
}