using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using SO115App.Persistence.File.PDFManagement.Templates.DettaglioChiamata;
using SO115App.Persistence.File.PDFManagement.Templates.DettaglioIntervento;
using System;
using System.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    public class PDFTemplateManager<TemplateModelForm> : IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        private readonly string _baseDocumentPath = Directory.GetCurrentDirectory();
        private readonly string _templateBasePath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..\\", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, "PDFManagement\\Templates"));
        private readonly string _fileName;

        private PdfDocument _document;

        private PDFTemplateManager() { }
        public PDFTemplateManager(string fileName)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            _document = PdfReader.Open($"{_templateBasePath}\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);

            _fileName = fileName;
        }

        public void GenerateDocument(TemplateModelForm template)
        {
            switch (template)
            {
                case DettaglioChiamataModelForm model: generaDettaglioCihamataPDF(model); break;

                case DettaglioInterventoModelForm model: generaDettaglioRichiestaPDF(model); break;
            }
        }

        public void SaveDocumentOnPublicFileFolder(TemplateModelForm template)
        {
            string fullPath = Path.Combine(_baseDocumentPath, "PublicFiles\\DettagliChiamate", _fileName);

            _document.Save(fullPath);
        }

        public string GetDocumentPath(string requestFolder)
        {
            return ($"http://localhost:31497/PublicFiles/{requestFolder}/{_fileName}").Split(_fileName)[0];
        }

        private void generaDettaglioCihamataPDF(DettaglioChiamataModelForm model)
        {
            #region FAKE

            PdfPage page = _document.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);

            XFont font = new XFont("Verdana", 50);

            gfx.DrawString("Hello, World!", font, XBrushes.Black, 0.0, 0.0, XStringFormats.Center);

            #endregion
        }

        private void generaDettaglioRichiestaPDF(DettaglioInterventoModelForm model)
        {
            #region FAKE

            PdfPage page = _document.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);

            XFont font = new XFont("Verdana", 50);

            gfx.DrawString("Hello, World!", font, XBrushes.Black, 0.0, 0.0, XStringFormats.Center);

            #endregion
        }
    }
}
