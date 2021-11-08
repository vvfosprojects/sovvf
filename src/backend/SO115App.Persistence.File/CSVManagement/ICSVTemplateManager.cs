using System.IO;

namespace SO115App.Persistence.File.CSVManagement
{
    public interface ICSVTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder);
    }
}