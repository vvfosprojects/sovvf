using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;

namespace SO115App.PDFManagement
{
    public class PDFManager
    {
        private PdfDocument pdfDocument;

        private PDFManager() { }
        public PDFManager(string filePath)
        {
            pdfDocument = PdfReader.Open(filePath, PdfDocumentOpenMode.Modify);
        }

        public void prova()
        {
            PdfPage page = pdfDocument.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);

            XFont font = new XFont("Verdana", 20, XFontStyle.BoldItalic);

            gfx.DrawString("Hello, World!", font, XBrushes.Black, new XRect(0, 0, page.Width, page.Height), XStringFormats.Center);


        }
    }
}
