using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetInfoAFM
{
    public class GetInfoAFMQuery : IQuery<GetInfoAFMResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public string RequestKey { get; set; }
    }
}
