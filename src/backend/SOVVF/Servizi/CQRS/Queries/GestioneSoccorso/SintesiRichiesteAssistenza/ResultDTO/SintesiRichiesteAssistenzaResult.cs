using System.Collections.Generic;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiestaAssistenza.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO
{
    public class SintesiRichiesteAssistenzaResult
    {
        public IEnumerable<SintesiRichiesta> SintesiRichieste { get; set; }
    }
}
