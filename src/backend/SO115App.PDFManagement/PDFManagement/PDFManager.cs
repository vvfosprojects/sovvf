using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    public class PDFManager
    {
        private PdfDocument _document;

        private PDFManager() { }
        public PDFManager(string filePath)
        {
            _document = PdfReader.Open(filePath, PdfDocumentOpenMode.Modify);
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        public void prova()
        {
            PdfPage page = _document.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);

            XFont font = new XFont("Verdana", 50);

            gfx.DrawString("Hello, World!", font, XBrushes.Black, new XRect(0, 0, page.Width, page.Height), XStringFormats.Center);
        }

        public void salva()
        {
            _document.Save("C:\\users\\francescodangelis\\desktop\\PDFResults\\prova.pdf");
        }
    }
}
