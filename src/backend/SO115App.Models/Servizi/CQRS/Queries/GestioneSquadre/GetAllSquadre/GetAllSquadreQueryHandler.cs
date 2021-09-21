using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSquadre.GetAllSquadre
{
    public class GetAllSquadreQueryHandler : IQueryHandler<GetAllSquadreQuery, GetAllSquadreResult>
    {
        private readonly IGetAllSquadre _service;

        public GetAllSquadreQueryHandler(IGetAllSquadre service)
        {
            _service = service;
        }

        public GetAllSquadreResult Handle(GetAllSquadreQuery query)
        {
            var lstSquadre = _service.GetByCodiceSede(query.CodiciSede).Result;

            return new GetAllSquadreResult() { DataArray = lstSquadre };
        }
    }
}
