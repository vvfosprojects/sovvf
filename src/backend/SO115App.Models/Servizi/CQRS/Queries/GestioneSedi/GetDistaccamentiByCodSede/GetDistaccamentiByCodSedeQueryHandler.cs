using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetDistaccamentiByCodSede
{
    public class GetDistaccamentiByCodSedeQueryHandler : IQueryHandler<GetDistaccamentiByCodSedeQuery, GetDistaccamentiByCodSedeResult>
    {
        private readonly IGetSedi _service;

        public GetDistaccamentiByCodSedeQueryHandler(IGetSedi service)
        {
            _service = service;
        }

        public GetDistaccamentiByCodSedeResult Handle(GetDistaccamentiByCodSedeQuery query)
        {
            var lstSedi = _service.GetAll().Result;

            //var codProvincia = query.CodiciSede[0]?.Split('.')[0];

            var result = lstSedi.Where(s => query.CodiciSede.Contains(s.Codice)).OrderBy(s => s.Codice).ToList();

            return new GetDistaccamentiByCodSedeResult() { DataArray = result };
        }
    }
}
