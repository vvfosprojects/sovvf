using System;

namespace SO115App.Persistence.File.PDFManagement.Templates.DettaglioChiamata
{
    public sealed class DettaglioChiamataModelForm
    {
        public string TitoloDistaccamento { get; set; } = null;
        public string NumeroChiamata { get; set; } = null;
        public DateTime DataOraChiamata { get; set; }

        public string Tipologia { get; set; } = null;
        public string Dettaglio { get; set; } = null;
        public string Civ_Km { get; set; } = null;
        public string Palazzo { get; set; } = null;
        public string Scala { get; set; } = null;
        public string Piano { get; set; } = null;
        public string Interno { get; set; } = null;

        public string Comune { get; set; } = null;
        public string Prov { get; set; } = null;

        public string Richiedente { get; set; } = null;
        public string RichiedenteTelefono { get; set; } = null;

        public string NoteChiamata { get; set; } = null;

        public string Operatore { get; set; } = null;
    }
}
