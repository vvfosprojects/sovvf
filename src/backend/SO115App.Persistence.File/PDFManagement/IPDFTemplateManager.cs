namespace SO115App.Persistence.File.PDFManagement
{
    public interface IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        void GenerateDocumentAndSave(TemplateModelForm template, string fileName);
        string GetDocumentPath(string requestFolder);
    }
}