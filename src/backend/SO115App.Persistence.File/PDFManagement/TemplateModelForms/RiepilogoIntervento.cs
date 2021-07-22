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

        public string Priorita { get; set; }
        public string CodTipologie { get; set; }
        public string Descrizione { get; set; }
        public string DettTipologie { get; set; }
        public string DescLuogo { get; set; }
        public string RifCoord { get; set; }
        public string Scala { get; set; }
        public string Piano { get; set; }
        public string Interno { get; set; }
        public string Telefono { get; set; }
        public string Competenza { get; set; }
        public string ZonaEmergenza { get; set; }

        public List<RiepilogoPartenza> lstPartenze { get; set; }
    }
}
