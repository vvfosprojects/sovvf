using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Classi.Triage;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage
{
    public class GetTriageResult
    {
        public Triage Triage { get; set; }
        public List<TriageData> TriageData { get; set; }
    }
}
