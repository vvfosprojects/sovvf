using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System.Linq;

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
            var lstSquadre = _service.GetByCodiceSede(query.CodiciSede);

            return new GetAllSquadreResult() { DataArray = lstSquadre.Result };
        }
    }
}
