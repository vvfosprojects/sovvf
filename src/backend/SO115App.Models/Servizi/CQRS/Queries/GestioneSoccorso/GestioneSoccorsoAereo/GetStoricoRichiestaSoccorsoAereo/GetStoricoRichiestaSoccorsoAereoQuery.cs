using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoRichiestaSoccorsoAereo
{
    public class GetStoricoRichiestaSoccorsoAereoQuery : IQuery<GetStoricoRichiestaSoccorsoAereoResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public string RequestKey { get; set; }
    }
}
