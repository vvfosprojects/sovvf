using CQRS.Queries;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetEmergenzaById
{
    public class GetEmergenzaByIdQueryHandler : IQueryHandler<GetEmergenzaByIdQuery, GetEmergenzaByIdResult>
    {
        private readonly IGetEmergenzaById _getEmergenza;

        public GetEmergenzaByIdQueryHandler(IGetEmergenzaById getEmergenza)
        {
            _getEmergenza = getEmergenza;
        }

        public GetEmergenzaByIdResult Handle(GetEmergenzaByIdQuery query)
        {
            return new GetEmergenzaByIdResult()
            {
                emergenza = _getEmergenza.Get(query.IdEmergenza)
            };
        }
    }
}
