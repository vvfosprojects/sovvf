using SO115App.Models.Classi.Triage;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage
{
    public class UpDateTriageCommand
    {
        public int CodTipologia { get; set; }
        public int codDettaglioTipologia { get; set; }
        public Triage Triage { get; set; }
        public List<TriageData> ListaTriageData { get; set; }
    }
}
