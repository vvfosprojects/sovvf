namespace SO115App.Persistence.File.PDFManagement
{
    public interface IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        void GenerateDocument(TemplateModelForm template, string fileName);
        void SaveDocumentOnPublicFileFolder(TemplateModelForm template);
        string GetDocumentPath(string requestFolder);
    }
}