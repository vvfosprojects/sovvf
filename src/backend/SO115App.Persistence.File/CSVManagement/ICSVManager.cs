using SO115App.Persistence.File.CSVManagement.TemplateModelForms;
using System.Collections.Generic;
using System.IO;

namespace SO115App.Persistence.File.CSVManagement
{
    public interface ICSVManager
    {
        MemoryStream GenerateAndDownload(List<ChiamataInSospeso> lstChiamateInSospeso);
    }
}
