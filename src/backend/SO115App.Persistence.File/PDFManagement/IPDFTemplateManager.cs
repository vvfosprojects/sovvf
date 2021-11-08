using System.IO;

namespace SO115App.Persistence.File.PDFManagement
{
    public interface IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder);
    }
}