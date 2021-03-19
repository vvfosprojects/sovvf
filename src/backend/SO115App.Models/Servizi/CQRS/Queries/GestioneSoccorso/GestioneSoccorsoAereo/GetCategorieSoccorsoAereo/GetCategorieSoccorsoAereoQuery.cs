using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo
{
    public class GetCategorieSoccorsoAereoQuery : IQuery<GetCategorieSoccorsoAereoResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }
    }
}
