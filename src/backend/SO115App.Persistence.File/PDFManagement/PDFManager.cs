using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System;
using System.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    public class PDFManager
    {
        private readonly string _baseDocumentPath = Directory.GetCurrentDirectory();
        private readonly string _templateBasePath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..\\", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, "PDFManagement\\Templates"));
        private readonly string _fileName;
        private PdfDocument _document;

        private PDFManager() { }
        public PDFManager(string fileName)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            _document = PdfReader.Open($"{_templateBasePath}\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);

            _fileName = fileName;
        }

        public void Genera()
        {
            PdfPage page = _document.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);

            XFont font = new XFont("Verdana", 50);

            gfx.DrawString("Hello, World!", font, XBrushes.Black, 0.0, 0.0, XStringFormats.Center);
        }

        public string Salva()
        {
            string fullPath = Path.Combine(_baseDocumentPath, "PublicFiles\\DettagliChiamate", _fileName.ToString());

            _document.Save(fullPath);

            return "http://localhost:31497/PublicFiles/DettagliChiamate/" + _fileName; 
        }
    }
}
