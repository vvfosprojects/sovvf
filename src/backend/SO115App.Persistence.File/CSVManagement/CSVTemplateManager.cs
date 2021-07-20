using CsvHelper;
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
            csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);
        }

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
            switch (template)
            {
                case DettaglioChiamataModelForm model: generaDettaglioChiamataCSV(model); break;

                case DettaglioInterventoModelForm model: generaDettaglioInterventoCSV(model); break;

                case RiepilogoInterventiModelForm model: generaRiepilogoInterventoCSV(model); break;

                default: throw new NotImplementedException("Template non gestito");
            }

            csvWriter.Flush();
            
            return memoryStream;
        }

        private void generaDettaglioChiamataCSV(DettaglioChiamataModelForm model)
        {
            csvWriter.WriteRecord(model);
        }

        private void generaDettaglioInterventoCSV(DettaglioInterventoModelForm model)
        {
            csvWriter.WriteRecord(model);
        }

        private void generaRiepilogoInterventoCSV(RiepilogoInterventiModelForm model)
        {
            csvWriter.WriteRecord(model);
        }
    }
}
