using CsvHelper;
using SO115App.Persistence.File.CSVManagement.TemplateModelForms;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace SO115App.Persistence.File.CSVManagement
{
    public class CSVManager : ICSVManager
    {
        public MemoryStream GenerateAndDownload(List<ChiamataInSospeso> lstChiamateInSospeso)
        {
            using (var memoryStream = new MemoryStream())
            {
                var streamWriter = new StreamWriter(memoryStream);
                var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);
                
                csvWriter.WriteRecords(lstChiamateInSospeso);
                
                return memoryStream;
            }
        }
    }
}
