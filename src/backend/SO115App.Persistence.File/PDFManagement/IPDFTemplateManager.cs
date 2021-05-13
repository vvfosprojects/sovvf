namespace SO115App.Persistence.File.PDFManagement
{
    public interface IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        string GenerateDocumentAndSave(TemplateModelForm template, string fileName, string requestFolder);
    }
}