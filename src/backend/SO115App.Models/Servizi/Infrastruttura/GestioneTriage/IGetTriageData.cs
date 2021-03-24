using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTriage
{
    public interface IGetTriageData
    {
        public List<TriageData> GetTriageData(GetTriageQuery getTriageQuery);
    }
}
