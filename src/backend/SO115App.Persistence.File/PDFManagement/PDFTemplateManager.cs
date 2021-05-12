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

        public void GenerateDocumentAndSave(TemplateModelForm template, string fileName)
        {
            _fileName = fileName;
            string fullPath;

            switch (template)
            {
                case DettaglioChiamataModelForm model:

                    _document = PdfReader.Open($"{_templateBasePath}\\DettaglioChiamata\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    fullPath = Path.Combine(_baseDocumentPath, "PublicFiles\\DettagliChiamate", _fileName);
                    generaDettaglioCihamataPDF(model); break;

                case DettaglioInterventoModelForm model:

                    _document = PdfReader.Open($"{_templateBasePath}\\DettaglioIntervento\\dettaglio_intervento.pdf", PdfDocumentOpenMode.Modify);
                    fullPath = Path.Combine(_baseDocumentPath, "PublicFiles\\DettagliIntervento", _fileName);
                    generaDettaglioRichiestaPDF(model); break;

                default: throw new NotImplementedException("Template non gestito");
            }

            //_document.Save(fullPath);
        }

        public string GetDocumentPath(string requestFolder)
        {
            return $"http://localhost:31497/PublicFiles/{requestFolder}/{_fileName}";
        }

        private void generaDettaglioCihamataPDF(DettaglioChiamataModelForm model)
        {
            static double AlignY(int x) => x * 1.02;

            PdfPage page = _document.Pages[0];
            XGraphics gfx = XGraphics.FromPdfPage(page);

            //IMPOSTO GLI STILI DELLE FONT
            var titolo = new XFont("Times new roman", 18, XFontStyle.Bold);
            var field = new XFont("Times new roman", 12);
            double y;

            //POPOLO IL PDF
            gfx.DrawString(model.TitoloDistaccamento, titolo, XBrushes.Black, 250, AlignY(40));

            y = AlignY(80);
            gfx.DrawString(model.NumeroChiamata ?? "", field, XBrushes.Black, 180, y);
            gfx.DrawString(model.DataOraChiamata.ToString("dd/MM/yyyy") ?? "", field, XBrushes.Black, 450, y);

            gfx.DrawString(model.DataOraChiamata.ToString("HH:mm") ?? "", field, XBrushes.Black, 450, AlignY(100));

            y = AlignY(150);
            gfx.DrawString(model.Tipologia ?? "", field, XBrushes.Black, 100, y);
            gfx.DrawString(model.Dettaglio?.Substring(0, 10) ?? "", field, XBrushes.Black, 350, y);

            y = AlignY(180);
            gfx.DrawString(model.Dettaglio?.Substring(10) ?? "", field, XBrushes.Black, 180, y);
            gfx.DrawString(model.Civ_Km ?? "", field, XBrushes.Black, 500, y);

            y = AlignY(216);
            gfx.DrawString(model.Palazzo ?? "", field, XBrushes.Black, 80, y);
            gfx.DrawString(model.Scala ?? "", field, XBrushes.Black, 220, y);
            gfx.DrawString(model.Piano ?? "", field, XBrushes.Black, 360, y);
            gfx.DrawString(model.Interno ?? "", field, XBrushes.Black, 520, y);

            y = AlignY(246);
            gfx.DrawString(model.Comune ?? "", field, XBrushes.Black, 100, y);
            gfx.DrawString(model.Prov ?? "", field, XBrushes.Black, 500, y);

            y = AlignY(285);
            gfx.DrawString(model.Richiedente ?? "", field, XBrushes.Black, 110, y);
            gfx.DrawString(model.RichiedenteTelefono ?? "", field, XBrushes.Black, 450, y);

            gfx.DrawString(model.NoteChiamata ?? "", field, XBrushes.Black, 130, AlignY(340));

            gfx.DrawString(model.Operatore ?? "", field, XBrushes.Black, 400, AlignY(740));
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
