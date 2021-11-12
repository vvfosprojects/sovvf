using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediTrasferimenti
{
    public class GetSediTrasferimentiQueryHandler : IQueryHandler<GetSediTrasferimentiQuery, GetSediTrasferimentiResult>
    {
        private readonly IGetSedi _service;
        public GetSediTrasferimentiQueryHandler(IGetSedi service)
        {
            _service = service;
        }

        public GetSediTrasferimentiResult Handle(GetSediTrasferimentiQuery query)
        {
            var lstSedi = _service.GetAll().Result;

            var result = lstSedi.FindAll(s=>s.Codice.Contains("1000")).OrderBy(s => s.Codice).ToList();

            return new GetSediTrasferimentiResult() { DataArray = result };
        }
    }
}
