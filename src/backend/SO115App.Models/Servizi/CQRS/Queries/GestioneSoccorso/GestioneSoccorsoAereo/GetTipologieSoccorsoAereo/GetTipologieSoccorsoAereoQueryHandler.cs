using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetTipologieSoccorsoAereo
{
    public class GetTipologieSoccorsoAereoQueryHandler : IQueryHandler<GetTipologieSoccorsoAereoQuery, GetTipologieSoccorsoAereoResult>
    {
        private readonly IGetTipologieSoccorsoAereo _getTipologieSoccorsoAereo;

        public GetTipologieSoccorsoAereoQueryHandler(IGetTipologieSoccorsoAereo getTipologieSoccorsoAereo)
        {
            _getTipologieSoccorsoAereo = getTipologieSoccorsoAereo;
        }

        public GetTipologieSoccorsoAereoResult Handle(GetTipologieSoccorsoAereoQuery query)
        {
            var result = _getTipologieSoccorsoAereo.Get();

            return new GetTipologieSoccorsoAereoResult()
            {
                DataArray = result
            };
        }
    }
}
