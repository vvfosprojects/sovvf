using Microsoft.Extensions.Configuration;
using PdfSharpCore;
using PdfSharpCore.Drawing;
using PdfSharpCore.Drawing.Layout;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using Serilog;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.IO;
using System.Text;

namespace SO115App.Persistence.File.PDFManagement
{
    internal sealed class PDFTemplateManager<TemplateModelForm> : IPDFTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        private PdfPage _page;
        private XGraphics _gfx;
        private double _y = _minY;

        private static readonly XFont _titolo = new XFont("Arial", 18);
        private static readonly XFont _field = new XFont("Arial", 9.5);
        private static readonly XFont _smallField = new XFont("Arial", 8);
        private static readonly XFont _xsmallField = new XFont("Arial", 7.5);
        private static readonly XPen _pen = new XPen(XColors.DarkGray, 0.5);
        private readonly IConfiguration _config;
        private const int _fieldHeight = 35;
        private const double _minY = 100;
        private const string _footer = "Stato dell'Intervento (S): A = Aperto C = Chiuso *Orari: Uscita - Arrivo sul posto - Partenza dal posto - Rientro Sigla mezzo andata e sigla mezzo ritorno N° Int : R = scheda ricevuta da altro comando T = scheda trasmessa ad altro comando Tipo Partenza(TP) M = Manuale I = Importata N = Normale Scheda Annullata = Informazioni barrate";

        private PdfDocument _document;

        public PDFTemplateManager(IConfiguration config)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            _config = config;
        }

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
            Log.Error($"Dettaglio QH - 1 **************** DENTRO GenerateAndDownload ************************");
            var path = _config.GetSection("GenericSettings").GetSection("PathTempateStampe").Value;

            Log.Error($"Dettaglio QH - 1 **************** Path {path} ************************");

            switch (template)
            {
                case DettaglioChiamataModelForm model:

                    _document = PdfReader.Open($"{path}/dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    generaDettaglioCihamataPDF(model); break;

                case DettaglioInterventoModelForm model:

                    _document = PdfReader.Open($"{path}/dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
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
            Func<int, double> altezza = partenze => _fieldHeight + 17 * partenze;

            if (model.lstRiepiloghi.Count == 0)
                checkNewPage(model, _y);

            model.lstRiepiloghi.ForEach(async riepilogo =>
            {
                double h = altezza(riepilogo.lstPartenze?.Count ?? 0);

                checkNewPage(model, _y + h);

                CreaRigaTabella(_y, h);
                PopolaRigaTabella(riepilogo, _y);

                _y += h;
            });

            void checkNewPage(RiepilogoInterventiModelForm model, double limiter)
            {
                if (limiter > 550)
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

                    //CREO LEGENDA TABELLA
                    var y = _minY - 10;
                    _gfx.DrawString("N° Int.", _smallField, XBrushes.Black, 18, y);
                    _gfx.DrawString("S.", _smallField, XBrushes.Black, 45, y);
                    _gfx.DrawString("Data Int.", _smallField, XBrushes.Black, 55, y);
                    _gfx.DrawString("Tur.", _smallField, XBrushes.Black, 127, y);
                    _gfx.DrawString("Tipologia", _smallField, XBrushes.Black, 147, y);
                    _gfx.DrawString("Località/Indirizzo", _smallField, XBrushes.Black, 280, y);
                    _gfx.DrawString("Km/Civ.", _smallField, XBrushes.Black, 400, y);
                    _gfx.DrawString("Comune", _smallField, XBrushes.Black, 437, y);
                    _gfx.DrawString("TP. Sch.", _smallField, XBrushes.Black, 500, y);
                    _gfx.DrawString("Squadra", _smallField, XBrushes.Black, 540, y);
                    _gfx.DrawString("Servizio", _smallField, XBrushes.Black, 600, y);
                    _gfx.DrawString("CapoPartenza", _smallField, XBrushes.Black, 650, y);
                    _gfx.DrawString("Orari Mezzo", _smallField, XBrushes.Black, 720, y);

                    //CREO FOOTER
                    var tf = new XTextFormatter(_gfx);
                    var rect = new XRect(10, 560, 820, 200);
                    _gfx.DrawRectangle(XBrushes.Transparent, rect);
                    //tf.Alignment = ParagraphAlignment.Left;
                    tf.DrawString(_footer, _smallField, XBrushes.Black, rect, XStringFormats.TopLeft);
                }
            }

            async void CreaRigaTabella(double y, double h)
            {
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 10, y, 30, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 40, y, 15, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 55, y, 70, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 125, y, 15, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 140, y, 120, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 260, y, 140, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 400, y, 40, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 440, y, 60, h);
                _gfx.DrawRectangle(_pen, XBrushes.Transparent, 500, y, 335, h);
            }

            async void PopolaRigaTabella(RiepilogoIntervento riepilogo, double y)
            {
                y += 10;

                _gfx.DrawString(riepilogo.NumeroIntervento.ToString(), _field, XBrushes.Black, 15, y);
                _gfx.DrawString(riepilogo.Stato.ToString(), _field, XBrushes.Black, 45, y);
                _gfx.DrawString(riepilogo.Data.ToString("dd/MM/yyyy"), _field, XBrushes.Black, 60, y);
                _gfx.DrawString(riepilogo.Data.ToString("HH:mm"), _field, XBrushes.Black, 60, y + 20);
                _gfx.DrawString(riepilogo.Turno, _field, XBrushes.Black, 125, y);
                var tf = new XTextFormatter(_gfx);
                var rect = new XRect(140, y - 10, 120, 200);
                _gfx.DrawRectangle(XBrushes.Transparent, rect);
                tf.DrawString(riepilogo.Tipologie, _field, XBrushes.Black, rect, XStringFormats.TopLeft);

                double x = 265;
                _gfx.DrawString(riepilogo.Indirizzo, _field, XBrushes.Black, x, y);
                _gfx.DrawString(riepilogo.Richiedente, _smallField, XBrushes.Black, x, y + 10);
                _gfx.DrawString(riepilogo.X, _xsmallField, XBrushes.Black, x, y + 20);
                _gfx.DrawString(riepilogo.Y, _xsmallField, XBrushes.Black, x + 50, y + 20);

                _gfx.DrawString(riepilogo.KmCiv, _field, XBrushes.Black, 400, y);
                tf = new XTextFormatter(_gfx);
                rect = new XRect(445, y - 10, 50, 200);
                _gfx.DrawRectangle(XBrushes.Transparent, rect);
                tf.DrawString(riepilogo.Comune, _field, XBrushes.Black, rect, XStringFormats.TopLeft);

                riepilogo.lstPartenze?.ForEach(async p =>
                {
                    _gfx.DrawString(p.TpSch, _field, XBrushes.Black, 500, y);
                    _gfx.DrawString(p.SiglaSquadra, _field, XBrushes.Black, 540, y);
                    _gfx.DrawString(p.Servizio ?? "", _field, XBrushes.Black, 600, y);
                    _gfx.DrawString(p.CapoPartenza ?? "", _field, XBrushes.Black, 650, y);
                    _gfx.DrawString(p.CodMezzo, _smallField, XBrushes.Black, 720, y + 10);

                    _gfx.DrawString(p.MezzoInUscita.ToString("HH:mm"), _smallField, XBrushes.Black, 720, y);
                    _gfx.DrawString(p.MezzoSulPosto?.ToString("/ HH:mm") ?? "/ --:--", _smallField, XBrushes.Black, 742, y);
                    _gfx.DrawString(p.MezzoInRientro?.ToString("/ HH:mm") ?? "/ --:--", _smallField, XBrushes.Black, 771, y);
                    _gfx.DrawString(p.MezzoRientrato?.ToString("/ HH:mm") ?? "/ --:--", _smallField, XBrushes.Black, 799, y);

                    y += 25;
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

        //ELIMIARE
        private double AlignY(int x) => x;
    }
}
