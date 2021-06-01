using System;
using System.Collections.Generic;

namespace SO115App.Persistence.File.PDFManagement.TemplateModelForms
{
    public sealed class RiepilogoIntervento
    {
        public int NumeroIntervento { get; set; }
        public char Stato { get; set; }
        public DateTime Data { get; set; }
        public string Turno { get; set; } = "";
        public string Tipologie { get; set; } = "";

        public string Indirizzo { get; set; } = "";
        public string Richiedente { get; set; } = "";
        public string X { get; set; }
        public string Y { get; set; }
        public string KmCiv { get; set; } = "";
        public string Comune { get; set; } = "";

        public List<RiepilogoPartenza> lstPartenze { get; set; }
    }
}
