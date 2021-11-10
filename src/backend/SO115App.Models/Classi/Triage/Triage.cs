namespace SO115App.Models.Classi.Triage
{
    public class Triage
    {
        public string Id { get; set; }
        public string CodiceSede { get; set; }
        public int CodTipologia { get; set; }
        public int CodDettaglioTipologia { get; set; }
        public Tree data { get; set; }
    }
}
