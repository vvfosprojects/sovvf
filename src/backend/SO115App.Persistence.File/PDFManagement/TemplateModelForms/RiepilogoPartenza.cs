using System;

namespace SO115App.Persistence.File.PDFManagement.TemplateModelForms
{
    public class RiepilogoPartenza
    {
        public string TpSch { get; set; } = "";
        public string SiglaSquadra { get; set; } = "";
        public string CodMezzo { get; set; } = "";
        public string Servizio { get; set; } = "";
        public string CapoPartenza { get; set; } = "";

        public DateTime MezzoInUscita { get; set; }
        public DateTime? MezzoSulPosto { get; set; } = null;
        public DateTime? MezzoInRientro { get; set; } = null;
        public DateTime? MezzoRientrato { get; set; } = null;
    }
}
