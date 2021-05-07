using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    public class PDFManager
    {
        private readonly string _basePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
        private string _fileName;
        private PdfDocument _document;

        private PDFManager() { }
        public PDFManager(string fileName)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            _document = PdfReader.Open(_basePath + "\\" + fileName, PdfDocumentOpenMode.Modify);

            _fileName = fileName;
        }

        public void modifica()
        {
            PdfPage page = _document.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);

            XFont font = new XFont("Verdana", 50);

            gfx.DrawString("Hello, World!", font, XBrushes.Black, 0.0, 0.0, XStringFormats.Center);
        }

        public string salva()
        {
            string fullPath = _basePath + _fileName;

            //_document.Save(fullPath);

            return fullPath;
        }
    }
}
