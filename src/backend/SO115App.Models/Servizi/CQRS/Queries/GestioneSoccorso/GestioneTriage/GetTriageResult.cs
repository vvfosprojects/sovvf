using SO115App.Models.Classi.Triage;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage
{
    public class GetTriageResult
    {
        public Triage Triage { get; set; }
        public List<TriageData> TriageData { get; set; }
    }
}
