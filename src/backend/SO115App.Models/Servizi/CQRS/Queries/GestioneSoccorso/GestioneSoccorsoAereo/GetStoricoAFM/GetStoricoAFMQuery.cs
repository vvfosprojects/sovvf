using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoAFM
{
    public class GetStoricoAFMQuery : IQuery<GetStoricoAFMResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public string RequestKey { get; set; }
    }
}
