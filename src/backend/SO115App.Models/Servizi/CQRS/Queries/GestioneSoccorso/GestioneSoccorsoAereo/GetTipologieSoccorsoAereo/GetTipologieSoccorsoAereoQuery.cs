using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetTipologieSoccorsoAereo
{
    public class GetTipologieSoccorsoAereoQuery : IQuery<GetTipologieSoccorsoAereoResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }
    }
}
