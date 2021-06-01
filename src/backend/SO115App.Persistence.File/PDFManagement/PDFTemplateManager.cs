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
        //TODO correggere path per test e prod
        private readonly string _templateFolder = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..\\", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, "PDFManagement\\Templates"));
        private PdfPage _page;
        private XGraphics _gfx;
        private const int _fieldHeight = 35;
        private const double _minY = 75;
        private double _y = _minY;

        //IMPOSTO GLI STILI
        private static readonly XFont _titolo = new XFont("Arial", 18);
        private static readonly XFont _field = new XFont("Arial", 9.5);
        private static readonly XFont _smallField = new XFont("Arial", 8);
        private static readonly XFont _xsmallField = new XFont("Arial", 7.5);
        private static readonly XPen _pen = new XPen(XColors.DarkGray, 0.5);

        private PdfDocument _document;

        public PDFTemplateManager() => Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
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

            var memoryStream = new MemoryStream();
            _document.Save(memoryStream);

            return memoryStream;
        }

        private void generaRiepilogoInterventiPDF(RiepilogoInterventiModelForm model)
        {
            Func<int, double> altezza = partenze => _fieldHeight + 20 * (partenze - 1);

            model.lstRiepiloghi.ForEach(async riepilogo =>
            {
                double h = altezza(riepilogo.lstPartenze.Count);

                checkNewPage(model, _y + h);

                CreaRigaTabella(_y, h);
                PopolaRigaTabella(riepilogo, _y);

                _y += h;
            });

            async void CreaRigaTabella(double y, double h)
            {
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 10, y, 50, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 60, y, 15, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 75, y, 100, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 175, y, 15, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 190, y, 120, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 310, y, 140, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 450, y, 40, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 490, y, 60, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 550, y, 300, h);
            }

            async void PopolaRigaTabella(RiepilogoIntervento riepilogo, double y)
            {
                y += 10;

                _gfx.DrawString(riepilogo.NumeroIntervento.ToString(), _field, XBrushes.Black, 20, y);
                _gfx.DrawString(riepilogo.Stato.ToString(), _field, XBrushes.Black, 40, y);
                _gfx.DrawString(riepilogo.Data.ToString("dd/MM/yyyy HH:mm"), _field, XBrushes.Black, 50, y);
                _gfx.DrawString(riepilogo.Turno, _field, XBrushes.Black, 160, y);
                _gfx.DrawString(riepilogo.Tipologie, _field, XBrushes.Black, 180, y);

                _gfx.DrawString(riepilogo.Indirizzo, _field, XBrushes.Black, 330, y);
                _gfx.DrawString(riepilogo.Richiedente, _smallField, XBrushes.Black, 330, y + 10);
                _gfx.DrawString(riepilogo.X, _xsmallField, XBrushes.Black, 330, y + 20);
                _gfx.DrawString(riepilogo.Y, _xsmallField, XBrushes.Black, 380, y + 20);

                _gfx.DrawString(riepilogo.KmCiv, _field, XBrushes.Black, 650, y);
                _gfx.DrawString(riepilogo.Comune, _field, XBrushes.Black, 450, y);

                riepilogo.lstPartenze.ForEach(async p =>
                {
                    _gfx.DrawString(p.MezzoInUscita.ToString("HH:mm"), _smallField, XBrushes.Black, 720, y);
                    _gfx.DrawString(p.MezzoSulPosto?.ToString("HH:mm") ?? "", _smallField, XBrushes.Black, 750, y);
                    _gfx.DrawString(p.MezzoRientrato?.ToString("HH:mm") ?? "", _smallField, XBrushes.Black, 780, y);
                    _gfx.DrawString(p.MezzoInRientro?.ToString("HH:mm") ?? "", _smallField, XBrushes.Black, 810, y);

                    y += 20;
                });
            }
        }

        private void generaDettaglioCihamataPDF(DettaglioChiamataModelForm model)
        {
            _page = _document.Pages[0];
            _gfx = XGraphics.FromPdfPage(_page);

            //IMPOSTO GLI STILI DELLE FONT
            var titolo = new XFont("Times new roman", 18, XFontStyle.Bold);
            var field = new XFont("Times new roman", 12);

            //POPOLO IL PDF
            _gfx.DrawString(model.Chiamata.TitoloDistaccamento, titolo, XBrushes.Black, 250, AlignY(40));

            _y = AlignY(80);
            _gfx.DrawString(model.Chiamata.NumeroChiamata ?? "", field, XBrushes.Black, 180, _y);
            _gfx.DrawString(model.Chiamata.DataOraChiamata.ToString("dd/MM/yyyy") ?? "", field, XBrushes.Black, 450, _y);

            _gfx.DrawString(model.Chiamata.DataOraChiamata.ToString("HH:mm") ?? "", field, XBrushes.Black, 450, AlignY(100));

            _y = AlignY(150);
            _gfx.DrawString(model.Chiamata.Tipologia ?? "", field, XBrushes.Black, 100, _y);
            _gfx.DrawString(model.Chiamata.Dettaglio?.Substring(0, 10) ?? "", field, XBrushes.Black, 350, _y);

            _y = AlignY(180);
            _gfx.DrawString(model.Chiamata.Dettaglio?.Substring(10) ?? "", field, XBrushes.Black, 180, _y);
            _gfx.DrawString(model.Chiamata.Civ_Km ?? "", field, XBrushes.Black, 500, _y);

            _y = AlignY(216);
            _gfx.DrawString(model.Chiamata.Palazzo ?? "", field, XBrushes.Black, 80, _y);
            _gfx.DrawString(model.Chiamata.Scala ?? "", field, XBrushes.Black, 220, _y);
            _gfx.DrawString(model.Chiamata.Piano ?? "", field, XBrushes.Black, 360, _y);
            _gfx.DrawString(model.Chiamata.Interno ?? "", field, XBrushes.Black, 520, _y);

            _y = AlignY(246);
            _gfx.DrawString(model.Chiamata.Comune ?? "", field, XBrushes.Black, 100, _y);
            _gfx.DrawString(model.Chiamata.Prov ?? "", field, XBrushes.Black, 500, _y);

            _y = AlignY(285);
            _gfx.DrawString(model.Chiamata.Richiedente ?? "", field, XBrushes.Black, 110, _y);
            _gfx.DrawString(model.Chiamata.RichiedenteTelefono ?? "", field, XBrushes.Black, 450, _y);

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

            _y = AlignY(400);
            model.lstPartenze.ForEach(partenza =>
            {
                _y = AlignY((int)_y + 20);
                _gfx.DrawString(partenza.SiglaMezzo ?? "", field, XBrushes.Black, 50, _y);
                _gfx.DrawString(partenza.TargaMezzo ?? "", field, XBrushes.Black, 150, _y);
                _gfx.DrawString(partenza.SiglaSquadra ?? "", field, XBrushes.Black, 250, _y);
                _gfx.DrawString(partenza.SchedaCapoPartenza ?? "", field, XBrushes.Black, 350, _y);
                _gfx.DrawString(partenza.OraAss.ToString("HH:mm") ?? "", field, XBrushes.Black, 450, _y);
            });
        }

        private void checkNewPage(RiepilogoInterventiModelForm model, double limiter)
        {
            if (limiter > 500) //TODO impostare limite esatto per nuova pagina
                _y = _minY;

            if (_y == _minY)
            {
                //CREO NUOVA PAGINA
                _page = _document.AddPage();
                _page.Width = XUnit.FromInch(8.3);
                _page.Height = XUnit.FromInch(11.7);
                _page.Orientation = PageOrientation.Landscape;
                _gfx = XGraphics.FromPdfPage(_page);

                //CREO L'INTESTAZIONE
                _gfx.DrawString(model.DescComando, _titolo, XBrushes.Black, 250, 40);
                //_gfx.DrawString(model.DescComando, _titolo, XBrushes.Black, 250, AlignY(40));
                //_gfx.DrawString(model.DescComando, _titolo, XBrushes.Black, 250, AlignY(40));
                //_gfx.DrawString(model.DescComando, _titolo, XBrushes.Black, 250, AlignY(40));
            }
        }


        private double AlignY(int x) => x;
    }
}
