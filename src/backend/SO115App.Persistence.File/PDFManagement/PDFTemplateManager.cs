using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using SO115App.Persistence.File.PDFManagement.Templates.DettaglioChiamata;
using SO115App.Persistence.File.PDFManagement.Templates.DettaglioIntervento;
using SO115App.Persistence.File.PDFManagement.Templates.RiepilogoInterventi;
using System;
using System.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    internal sealed class PDFTemplateManager<TemplateModelForm> : IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        private readonly string _baseDocumentPath = Directory.GetCurrentDirectory();
        private readonly string _templateBasePath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..\\", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, "PDFManagement\\Templates"));
        private string _fileName;

        private PdfDocument _document;

        //private PDFTemplateManager() { }
        public PDFTemplateManager()
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        public void GenerateDocument(TemplateModelForm template, string fileName)
        {
            _fileName = fileName;

            switch (template)
            {
                case DettaglioChiamataModelForm model:
                    _document = PdfReader.Open($"{_templateBasePath}\\DettaglioChiamata\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    generaDettaglioCihamataPDF(model); break;

                case DettaglioInterventoModelForm model:
                    _document = PdfReader.Open($"{_templateBasePath}\\DettaglioIntervento\\dettaglio_intervento.pdf", PdfDocumentOpenMode.Modify);
                    generaDettaglioRichiestaPDF(model); break;

                //case RiepilogoInterventiModelForm model:
                //    break;
            }
        }
            
        public void SaveDocumentOnPublicFileFolder(TemplateModelForm template)
        {
            string fullPath = null;

            switch (template)
            {
                case DettaglioChiamataModelForm model:
                    fullPath = Path.Combine(_baseDocumentPath, "PublicFiles\\DettagliChiamate", _fileName); break;

                case DettaglioInterventoModelForm model:
                    fullPath = Path.Combine(_baseDocumentPath, "PublicFiles\\DettagliIntervento", _fileName); break;
            }

            _document.Save(fullPath);
        }

        public string GetDocumentPath(string requestFolder)
        {
            return $"http://localhost:31497/PublicFiles/{requestFolder}/{_fileName}";
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
