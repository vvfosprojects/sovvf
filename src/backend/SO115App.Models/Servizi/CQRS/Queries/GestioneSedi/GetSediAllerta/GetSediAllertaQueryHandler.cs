using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediAllerta
{
    public class GetSediAllertaQueryHandler : IQueryHandler<GetSediAllertaQuery, GetSediAllertaResult>
    {
        private readonly IGetSedi _service;
        public GetSediAllertaQueryHandler(IGetSedi service)
        {
            _service = service;
        }

        public GetSediAllertaResult Handle(GetSediAllertaQuery query)
        {
            var lstSedi = _service.GetSediAllerta();

            var result = lstSedi.Where(s => s.attiva == 1 && s.codFiglio_TC == 1000)
                .Select(s => new Sede($"{s.codProv}.{s.codFiglio_TC}", s.sede, "", new Coordinate(s.latitudine, s.longitudine), "", "", "", "", "", false))
                .OrderBy(s => s.Codice)
                .ToList();

            return new GetSediAllertaResult() { DataArray = result };
        }
    }
}
