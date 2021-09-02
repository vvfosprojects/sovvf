using CsvHelper;
using CsvHelper.Configuration;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.Globalization;
using System.IO;

namespace SO115App.Persistence.File.CSVManagement
{
    internal sealed class CSVTemplateManager<TemplateModelForm> : ICSVTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        private MemoryStream memoryStream; 
        private StreamWriter streamWriter; 
        private CsvWriter csvWriter;

        public CSVTemplateManager() 
        {
            memoryStream = new MemoryStream();
            streamWriter = new StreamWriter(memoryStream);
            csvWriter = new CsvWriter(streamWriter, new CsvConfiguration(CultureInfo.InvariantCulture));

            csvWriter.Context.Configuration.Delimiter = ";";
        }

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
            switch (template)
            {
                case RiepilogoInterventiModelForm model: generaRiepilogoInterventoCSV(model); break;

                case DettaglioChiamataModelForm model: generaDettaglioChiamataCSV(model); break;

                default: throw new NotImplementedException("Template non gestito");
            }

            csvWriter.Flush();
            
            return memoryStream;
        }

        private void generaRiepilogoInterventoCSV(RiepilogoInterventiModelForm model)
        {
            string str = "TIPO;NUMERO;PRIORITA;DATA_CHIAMATA;ORA_CHIAMATA;DATA_INTERVENTO;COD_TIPOLOGIA;DESCRIZIONE;DETTAGLIO_TIPOLOGIA;DESC_LUOGO;COMUNE;X;Y;RIF_COORD;SCALA;PIANO;INTERNO;RICHIEDENTE;TELE_NUMERO;COMPETENZA;ZONA_EMERGENZA";

            streamWriter.WriteLine(str);

            foreach (var chiamata in model.lstRiepiloghi)
            {
                str = string.Join(';', new string[] 
                { 
                    chiamata.Stato.ToString(), 
                    chiamata.NumeroIntervento.ToString(),
                    chiamata.Priorita,
                    chiamata.Data.ToString("dd/MM/yyyy"),
                    chiamata.Data.ToString("HH:mm"),
                    chiamata.Data.ToString("dd/MM/yyyy"),
                    chiamata.Tipologie,
                    chiamata.CodTipologie,
                    chiamata.Descrizione,
                    chiamata.DettTipologie,
                    chiamata.DescLuogo,
                    chiamata.Comune,
                    chiamata.X,
                    chiamata.Y,
                    chiamata.RifCoord,
                    chiamata.Scala,
                    chiamata.Piano,
                    chiamata.Interno,
                    chiamata.Richiedente,
                    chiamata.Telefono,
                    chiamata.Competenza,
                    chiamata.ZonaEmergenza
                });

                streamWriter.WriteLine(str);
            }
        }

        private void generaDettaglioChiamataCSV(DettaglioChiamataModelForm model)
        {
            string str = "CIV_KM;COMUNE;DATA_ORA_CHIAMATA;DETTAGLIO;INTERNO;NOTE_CHIAMATA;NUMERO_CHIAMATA;OPERATORE;PALAZZO;PIANO;PROV;RICHIEDENTE;RICHIEDENTE_TELEFONO;SCALA;TIPOLOGIA;TITOLO_DISTACCAMENTO";

            streamWriter.WriteLine(str);

            str = string.Join(';', new string[]
            {
                model.Chiamata.Civ_Km,
                model.Chiamata.Comune,
                model.Chiamata.DataOraChiamata.ToString("dd/MM/yyyy"),
                model.Chiamata.Dettaglio,
                model.Chiamata.Interno,
                model.Chiamata.NoteChiamata,
                model.Chiamata.NumeroChiamata,
                model.Chiamata.Operatore,
                model.Chiamata.Palazzo,
                model.Chiamata.Piano,
                model.Chiamata.Prov,
                model.Chiamata.Richiedente,
                model.Chiamata.RichiedenteTelefono,
                model.Chiamata.Scala,
                model.Chiamata.Tipologia,
                model.Chiamata.TitoloDistaccamento
            });

            streamWriter.WriteLine(str);            
        }
    }
}
