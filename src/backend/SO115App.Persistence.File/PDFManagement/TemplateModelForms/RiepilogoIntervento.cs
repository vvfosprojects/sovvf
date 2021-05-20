using System;

namespace SO115App.Persistence.File.PDFManagement.TemplateModelForms
{
    public sealed class RiepilogoIntervento
    {
        public int NumeroIntervento { get; set; }
        public char Stato { get; set; }
        public DateTime Data { get; set; }
        public string Turno { get; set; }
        public string Tipologie { get; set; }

        public string Indirizzo { get; set; }
        public string Richiedente { get; set; }
        public double X { get; set; }
        public double Y { get; set; }

        public string KmCiv { get; set; }
        public string Comune { get; set; }
        public string TpSch { get; set; }
        public string SiglaSquadra { get; set; }
        public string Servizio { get; set; }
        public string CapoPartenza { get; set; }

        public DateTime MezzoInUscita { get; set; }
        public DateTime? MezzoSulPosto { get; set; }
        public DateTime? MezzoInRientro { get; set; }
        public DateTime? MezzoRientrato { get; set; }
    }
}
