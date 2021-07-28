using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;

namespace SO115App.Persistence.MongoDB.GestioneSchedeContatto
{
    public class GetSchedeContatto : IGetSchedeContatto_WSNUE
    {
        private readonly DbContext _dbContext;

        public GetSchedeContatto(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<SchedaContatto> GetAllSchedeContatto(string CodiceSede)
        {
            List<SchedaContatto> listaSchedeContatto = new List<SchedaContatto>();
            var ListaSchedeContattoWSNue = new List<SchedaContattoWSNue>();

            if (CodiceSede.Length > 0)
                ListaSchedeContattoWSNue = _dbContext.SchedeNueCollection.Find(s => s.codiceSede.Equals(CodiceSede)).ToList();
            else
                ListaSchedeContattoWSNue = _dbContext.SchedeNueCollection.Find(Builders<SchedaContattoWSNue>.Filter.Empty).ToList();

            foreach (SchedaContattoWSNue scheda in ListaSchedeContattoWSNue)
            {
                listaSchedeContatto.Add(MappaSchedaContatto(scheda));
            }

            return listaSchedeContatto;
        }

        private SchedaContatto MappaSchedaContatto(SchedaContattoWSNue scheda)
        {
            Regex regex = new Regex(@">\s*<");
            XmlDocument SchedaXml = new XmlDocument();
            XmlNamespaceManager namespaces = new XmlNamespaceManager(SchedaXml.NameTable);
            namespaces.AddNamespace("nue", "http://NUE.112.it/NUE112");
            string cleanedXml = regex.Replace(scheda.SchedaContatto, "><");
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

            if (!Competenza.Equals(scheda.SedeDestinataria))
            {
                foreach (XmlNode nodo in ListaConoscenza)
                {
                    if (nodo.SelectSingleNode("//nue:Code", namespaces).InnerText.Equals(scheda.SedeDestinataria))
                    {
                        conoscenza = true;
                    }
                }
            }

            string classificazione = "";

            if (conoscenza)
                classificazione = "Conoscenza";
            else if (Competenza.Equals(scheda.SedeDestinataria))
                classificazione = "Competenza";
            else
                classificazione = "Deferibile";

            SchedaContatto schedaMapped = new SchedaContatto()
            {
                Classificazione = classificazione,
                ClassificazioneEvento = SchedaXml.SelectSingleNode("//nue:Classification", namespaces).InnerText,
                CodiceSede = scheda.codiceSede,
                CodiceScheda = SchedaXml.SelectSingleNode("//nue:ID", namespaces).InnerText,
                DataInserimento = Convert.ToDateTime(SchedaXml.SelectSingleNode("//nue:CreateDate", namespaces).InnerText),
                Dettaglio = SchedaXml.SelectSingleNode("//nue:ClassificationDetail", namespaces).InnerText,
                EnteCompetenza = SchedaXml.SelectSingleNode("//nue:CompetenceType", namespaces).InnerText,
                id = scheda.Id,
                NumeroPersoneCoinvolte = Convert.ToInt16(SchedaXml.SelectSingleNode("//nue:InvolvedNumber", namespaces).InnerText),
                Priorita = Convert.ToInt16(SchedaXml.SelectSingleNode("//nue:HighPriority", namespaces).InnerText == "TRUE" ? "1" : "0"),
                Richiedente = new API.Models.Classi.Condivise.Richiedente(Nome + " " + Cognome, Telefono),
                Localita = new API.Models.Classi.Condivise.Localita(coordinate, "", ""),
                AttributoClassificazione = SchedaXml.SelectSingleNode("//nue:ClassificationAttribute", namespaces).InnerText,
            };

            return schedaMapped;
        }
    }
}
