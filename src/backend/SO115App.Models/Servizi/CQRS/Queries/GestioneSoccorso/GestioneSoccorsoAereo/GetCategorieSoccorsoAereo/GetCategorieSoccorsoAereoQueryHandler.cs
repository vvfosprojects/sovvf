using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo
{
    public class GetCategorieSoccorsoAereoQueryHandler : IQueryHandler<GetCategorieSoccorsoAereoQuery, GetCategorieSoccorsoAereoResult>
    {
        private readonly IGetCategorieSoccorsoAereo _getCategorieSoccorsoAereo;

        public GetCategorieSoccorsoAereoQueryHandler(IGetCategorieSoccorsoAereo getCategorieSoccorsoAereo)
        {
            _getCategorieSoccorsoAereo = getCategorieSoccorsoAereo;
        }

        public GetCategorieSoccorsoAereoResult Handle(GetCategorieSoccorsoAereoQuery query)
        {
            var result = _getCategorieSoccorsoAereo.Get();

            return new GetCategorieSoccorsoAereoResult()
            {
                DataArray = result
            };
        }
    }
}
