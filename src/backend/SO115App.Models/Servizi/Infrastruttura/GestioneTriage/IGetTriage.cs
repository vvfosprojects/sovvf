using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTriage
{
    public interface IGetTriage
    {
        public Triage GetTriage(GetTriageQuery getTriageQuery);
    }
}
