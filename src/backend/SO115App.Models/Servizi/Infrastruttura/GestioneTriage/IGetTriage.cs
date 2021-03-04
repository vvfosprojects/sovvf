using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTriage
{
    public interface IGetTriage
    {
        public Triage GetTriage(GetTriageQuery getTriageQuery);
    }
}
