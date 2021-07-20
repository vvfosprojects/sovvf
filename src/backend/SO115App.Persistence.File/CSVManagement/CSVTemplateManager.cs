using CsvHelper;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.Globalization;
using System.IO;

namespace SO115App.Persistence.File.CSVManagement
{
    internal sealed class CSVTemplateManager<TemplateModelForm> : ICSVTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        public CSVTemplateManager() { }

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
            var memoryStream = new MemoryStream();
            
            var streamWriter = new StreamWriter(memoryStream);

            var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);

            switch (template)
            {
                case DettaglioChiamataModelForm model: /*generaDettaglioCihamataPDF(model);*/ break;

                case DettaglioInterventoModelForm model: /*generaDettaglioInterventoPDF(model);*/ break;

                case RiepilogoInterventiModelForm model: /*generaRiepilogoInterventiPDF(model);*/ break;

                default: throw new NotImplementedException("Template non gestito");
            }

            //_document.Save(memoryStream);

            return memoryStream;

            //csvWriter.WriteRecords(lstChiamateInSospeso);

            csvWriter.Flush();
            
            return memoryStream;
        }
    }
}
