using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo
{
    public class GetCategorieSoccorsoAereoQueryHandler : IQueryHandler<GetCategorieSoccorsoAereoQuery, GetCategorieSoccorsoAereoResult>
    {
        private readonly IGetCategorieSoccorsoAereo getCategorieSoccorsoAereo;

        public GetCategorieSoccorsoAereoResult Handle(GetCategorieSoccorsoAereoQuery query)
        {
            var result = getCategorieSoccorsoAereo.Get();

            return new GetCategorieSoccorsoAereoResult()
            {
                DataArray = result
            };
        }
    }
}
