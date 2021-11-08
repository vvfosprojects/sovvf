using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSedi
{
    public class GetSediQueryHandler : IQueryHandler<GetSediQuery, GetSediResult>
    {
        private readonly IGetSedi _service;
        public GetSediQueryHandler(IGetSedi service)
        {
            _service = service;
        }

        public GetSediResult Handle(GetSediQuery query)
        {
            var lstSedi = _service.GetAll().Result;

            var result = lstSedi.OrderBy(s => s.Codice).ToList();

            return new GetSediResult() { DataArray = result };
        }
    }
}
