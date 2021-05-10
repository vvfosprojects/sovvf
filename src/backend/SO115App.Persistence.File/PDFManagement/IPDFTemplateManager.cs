using System.Threading.Tasks;

namespace SO115App.Persistence.File.PDFManagement
{
    public interface IPDFTemplateManager<TemplateModel> where TemplateModel : class
    {
        void GenerateDocument(TemplateModel template);
        void SaveDocumentOnPublicFileFolder(TemplateModel template);
        string GetDocumentPath(string requestFolder);
    }
}