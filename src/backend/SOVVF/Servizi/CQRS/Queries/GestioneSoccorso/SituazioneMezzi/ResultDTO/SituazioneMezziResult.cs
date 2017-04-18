using System.Collections.Generic;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO
{
    public class SituazioneMezziResult
    {
        public IEnumerable<SituazioneMezzo> SituazioneMezzi { get; set; }
    }
}
