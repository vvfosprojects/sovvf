using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetInterventiVicinanze
{
    public class GetInterventiVicinanzeResult
    {
        public List<SintesiRichiesta> DataArray { get; set; }

        public List<SintesiRichiesta> DataArrayStessaVia { get; set; }

        public List<SintesiRichiesta> DataArrayInterventiChiusiStessoIndirizzo { get; set; }
    }
}
