using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
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
            var lstSedi = _service.GetAll();

            var result = lstSedi.Where(s => s.attiva == 1 && s.codFiglio_TC >= 1000)
                .Select(s => new Sede($"{s.codProv}.{s.codFiglio_TC}", s.sede, "", new Coordinate(s.latitudine, s.longitudine), "", "", "", "", ""))
                .OrderBy(s => s.Codice)
                .ToList();

            return new GetDistaccamentiByCodSedeResult() { DataArray = result };
        }
    }
}
