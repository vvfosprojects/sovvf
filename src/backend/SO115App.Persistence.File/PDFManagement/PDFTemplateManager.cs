using PdfSharp;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    internal sealed class PDFTemplateManager<TemplateModelForm> : IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        private static readonly string _templateFolder = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..\\", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, "PDFManagement\\Templates"));
        private static PdfPage _page;
        private static XGraphics _gfx;
        private const int _fieldHeight = 40;

        //IMPOSTO GLI STILI
        private static XFont _titolo = new XFont("Arial", 18);
        private static XFont _field = new XFont("Arial", 9.5);
        private static XFont _smallField = new XFont("Arial", 8);
        private static XPen _pen = new XPen(XColors.Black, 0.5);

        private static PdfDocument _document;

        public PDFTemplateManager() => Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
            var memoryStream = new MemoryStream();

            switch (template)
            {
                case DettaglioChiamataModelForm model:

                    _document = PdfReader.Open($"{_templateFolder}\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    generaDettaglioCihamataPDF(model); break;

                case DettaglioInterventoModelForm model:

                    _document = PdfReader.Open($"{_templateFolder}\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    generaDettaglioInterventoPDF(model); break;

                case RiepilogoInterventiModelForm model:

                    _document = new PdfDocument();
                    generaRiepilogoInterventiPDF(model); break;

                default: throw new NotImplementedException("Template non gestito");
            }

            _document.Save(memoryStream);

            return memoryStream;
        }

        private static void generaRiepilogoInterventiPDF(RiepilogoInterventiModelForm model)
        {
            _page = _document.AddPage();
            _gfx = XGraphics.FromPdfPage(_page);
            //A4 FORMATO
            _page.Width = XUnit.FromInch(8.3);
            _page.Height = XUnit.FromInch(11.7);
            _page.Orientation = PageOrientation.Landscape;

            double stringsY;

            static void CreaRigaTabella(int y, int partenze)
            {
                int h = _fieldHeight * partenze;
                y -= 20;
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 10, y, 50, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 60, y, 20, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 80, y, 100, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 180, y, 20, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 200, y, 100, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 300, y, 100, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 400, y, 50, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 450, y, 50, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 500, y, 300, h);

                //TODO CHECK NUOVA PAGINA
            }

            //POPOLO IL PDF////////////
            _gfx.DrawString(model.DescComando, _titolo, XBrushes.Black, 250, AlignY(40));
            //

            stringsY = AlignY(100);
            model.lstRiepiloghi.ForEach(riepilogo =>
            {
                //RIGHE TABELLA
                CreaRigaTabella((int)stringsY, riepilogo.lstPartenze.Count);

                //POPOLO LA TABELLA
                _gfx.DrawString(riepilogo.NumeroIntervento.ToString(), _field, XBrushes.Black, 20, stringsY - 10);
                _gfx.DrawString(riepilogo.Stato.ToString(), _field, XBrushes.Black, 40, stringsY - 10);
                _gfx.DrawString(riepilogo.Data.ToString("dd/MM/yyyy HH:mm"), _field, XBrushes.Black, 50, stringsY - 10);
                _gfx.DrawString(riepilogo.Turno, _field, XBrushes.Black, 160, stringsY - 10);
                _gfx.DrawString(riepilogo.Tipologie, _field, XBrushes.Black, 180, stringsY - 10);

                _gfx.DrawString(riepilogo.Indirizzo, _field, XBrushes.Black, 330, stringsY - 10);
                _gfx.DrawString(riepilogo.Richiedente, _smallField, XBrushes.Black, 330, stringsY);
                _gfx.DrawString(riepilogo.X, _smallField, XBrushes.Black, 330, stringsY + 10);
                _gfx.DrawString(riepilogo.Y, _smallField, XBrushes.Black, 380, stringsY + 10);

                _gfx.DrawString(riepilogo.KmCiv, _field, XBrushes.Black, 650, stringsY - 10);
                _gfx.DrawString(riepilogo.Comune, _field, XBrushes.Black, 450, stringsY - 10);

                int i = 0;
                riepilogo.lstPartenze.ForEach(p =>
                {
                    i += 1;
                    bool primaRiga = i == 1;
                    if (!primaRiga) stringsY += 20;

                    _gfx.DrawString(p.MezzoInUscita.ToString("HH:mm"), _smallField, XBrushes.Black, 720, stringsY - 10);
                    _gfx.DrawString(p.MezzoSulPosto?.ToString("HH:mm") ?? "", _smallField, XBrushes.Black, 750, stringsY - 10);
                    _gfx.DrawString(p.MezzoRientrato?.ToString("HH:mm") ?? "", _smallField, XBrushes.Black, 780, stringsY - 10);
                    _gfx.DrawString(p.MezzoInRientro?.ToString("HH:mm") ?? "", _smallField, XBrushes.Black, 810, stringsY - 10);

                    if (!primaRiga) stringsY -= 20;

                    stringsY = AlignY((int)stringsY + _fieldHeight);
                });
            });
        }

        private void generaDettaglioCihamataPDF(DettaglioChiamataModelForm model)
        {
            _page = _document.Pages[0];
            _gfx = XGraphics.FromPdfPage(_page);

            //IMPOSTO GLI STILI DELLE FONT
            var titolo = new XFont("Times new roman", 18, XFontStyle.Bold);
            var field = new XFont("Times new roman", 12);
            double y;

            //POPOLO IL PDF
            _gfx.DrawString(model.Chiamata.TitoloDistaccamento, titolo, XBrushes.Black, 250, AlignY(40));

            y = AlignY(80);
            _gfx.DrawString(model.Chiamata.NumeroChiamata ?? "", field, XBrushes.Black, 180, y);
            _gfx.DrawString(model.Chiamata.DataOraChiamata.ToString("dd/MM/yyyy") ?? "", field, XBrushes.Black, 450, y);

            _gfx.DrawString(model.Chiamata.DataOraChiamata.ToString("HH:mm") ?? "", field, XBrushes.Black, 450, AlignY(100));

            y = AlignY(150);
            _gfx.DrawString(model.Chiamata.Tipologia ?? "", field, XBrushes.Black, 100, y);
            _gfx.DrawString(model.Chiamata.Dettaglio?.Substring(0, 10) ?? "", field, XBrushes.Black, 350, y);

            y = AlignY(180);
            _gfx.DrawString(model.Chiamata.Dettaglio?.Substring(10) ?? "", field, XBrushes.Black, 180, y);
            _gfx.DrawString(model.Chiamata.Civ_Km ?? "", field, XBrushes.Black, 500, y);

            y = AlignY(216);
            _gfx.DrawString(model.Chiamata.Palazzo ?? "", field, XBrushes.Black, 80, y);
            _gfx.DrawString(model.Chiamata.Scala ?? "", field, XBrushes.Black, 220, y);
            _gfx.DrawString(model.Chiamata.Piano ?? "", field, XBrushes.Black, 360, y);
            _gfx.DrawString(model.Chiamata.Interno ?? "", field, XBrushes.Black, 520, y);

            y = AlignY(246);
            _gfx.DrawString(model.Chiamata.Comune ?? "", field, XBrushes.Black, 100, y);
            _gfx.DrawString(model.Chiamata.Prov ?? "", field, XBrushes.Black, 500, y);

            y = AlignY(285);
            _gfx.DrawString(model.Chiamata.Richiedente ?? "", field, XBrushes.Black, 110, y);
            _gfx.DrawString(model.Chiamata.RichiedenteTelefono ?? "", field, XBrushes.Black, 450, y);

            _gfx.DrawString(model.Chiamata.NoteChiamata ?? "", field, XBrushes.Black, 130, AlignY(340));

            _gfx.DrawString(model.Chiamata.Operatore ?? "", field, XBrushes.Black, 400, AlignY(710));
        }

        private void generaDettaglioInterventoPDF(DettaglioInterventoModelForm model)
        {
            //IMPOSTO GLI STILI DELLE FONT
            var titolo = new XFont("Times new roman", 18, XFontStyle.Bold);
            var field = new XFont("Times new roman", 12);
            var label = new XFont("Times new roman", 12, XFontStyle.Bold);

            var chiamata = new DettaglioChiamataModelForm() { Chiamata = model.Chiamata };

            generaDettaglioCihamataPDF(chiamata);

            var y = AlignY(400);
            model.lstPartenze.ForEach(partenza =>
            {
                y = AlignY((int)y + 20);
                _gfx.DrawString(partenza.SiglaMezzo ?? "", field, XBrushes.Black, 50, y);
                _gfx.DrawString(partenza.TargaMezzo ?? "", field, XBrushes.Black, 150, y);
                _gfx.DrawString(partenza.SiglaSquadra ?? "", field, XBrushes.Black, 250, y);
                _gfx.DrawString(partenza.SchedaCapoPartenza ?? "", field, XBrushes.Black, 350, y);
                _gfx.DrawString(partenza.OraAss.ToString("HH:mm") ?? "", field, XBrushes.Black, 450, y);
            });
        }

        private static double AlignY(int x) => x;
    }
}
