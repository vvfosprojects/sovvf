using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
            var result = _service.GetAll().Select(s => new Sede(s.codProv, s.sede, "", new Coordinate(s.latitudine, s.longitudine), "", "", "", "", "")).ToList();

            return new GetSediResult() { DataArray = result };
        }
    }
}
