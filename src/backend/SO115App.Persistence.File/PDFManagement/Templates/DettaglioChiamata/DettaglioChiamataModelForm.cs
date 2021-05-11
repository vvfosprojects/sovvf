using System;

namespace SO115App.Persistence.File.PDFManagement.Templates.DettaglioChiamata
{
    public sealed class DettaglioChiamataModelForm
    {
        public string TitoloDistaccamento { get; set; }
        public string NumeroChiamata { get; set; } = null;
        public DateTime DataOraChiamata { get; set; }

        public string Tipologia { get; set; }
        public string Dettaglio { get; set; }
        public string Civ_Km { get; set; }
        public string Palazzo { get; set; }
        public string Scala { get; set; }
        public string Piano { get; set; }
        public string Interno { get; set; }

        public string Comune { get; set; }
        public string Prov { get; set; }

        public string Richiedente { get; set; }
        public string RichiedenteTelefono { get; set; }

        public string NoteChiamata { get; set; }

        public string Operatore { get; set; }
    }
}
