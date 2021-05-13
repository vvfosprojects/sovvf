using Microsoft.AspNetCore.Hosting;
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
        private string _fullPath;
        private readonly string _templateBasePath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "..\\", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, "PDFManagement\\Templates"));
        private PdfPage _page;
        private XGraphics _gfx;
        private string _fileName;

        private PdfDocument _document;

        public PDFTemplateManager(IHostingEnvironment env)
        {
            _fullPath = env.WebRootPath;
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        public void GenerateDocumentAndSave(TemplateModelForm template, string fileName)
        {
            _fileName = fileName;

            switch (template)
            {
                case DettaglioChiamataModelForm model:

                    _document = PdfReader.Open($"{_templateBasePath}\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    _fullPath = Path.Combine(_fullPath, "DettagliChiamate", _fileName);
                    generaDettaglioCihamataPDF(model); break;

                case DettaglioInterventoModelForm model:

                    _document = PdfReader.Open($"{_templateBasePath}\\dettaglio_chiamata.pdf", PdfDocumentOpenMode.Modify);
                    _fullPath = Path.Combine(_fullPath, "DettagliInterventi", _fileName);
                    generaDettaglioInterventoPDF(model); break;

                case RiepilogoInterventiModelForm model:

                    _fullPath = Path.Combine(_fullPath, "RiepiloghiInterventi", _fileName); 
                    break;

                default: throw new NotImplementedException("Template non gestito");
            }

            _document.Save(_fullPath);
        }

        public string GetDocumentPath(string requestFolder)
        {
            return $"http://localhost:31497/{requestFolder}/{_fileName}";//.Split(_fileName)[0];
        }

        private static double AlignY(int x) => x * 1.02;

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
    }
}
