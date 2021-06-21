using SO115App.Models.Classi.Pos;

namespace SO115App.Models.Classi.Condivise
{
    public class TipologiaDettaglio
    {
        public string Id { get; set; }
        public string CodSede { get; set; }
        public int CodiceTipologia { get; set; }
        public int CodiceDettaglioTipologia { get; set; }
        public string Descrizione { get; set; }
        public bool Ricorsivo { get; set; }
        public PosDAO? Pos { get; set; }
    }
}
