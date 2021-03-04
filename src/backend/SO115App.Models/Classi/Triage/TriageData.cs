namespace SO115App.Models.Classi.Triage
{
    public class TriageData
    {
        public string Id { get; set; }
        public string CodiceSede { get; set; }
        public int CodTipologia { get; set; }
        public int CodDettaglioTipologia { get; set; }
        public string ItemValue { get; set; }
        public string SoccorsoAereo { get; set; }
        public string[] GeneriMezzo { get; set; }
        public string PrioritaConsigliata { get; set; }

        public string NoteOperatore { get; set; }
    }
}
