using CQRS.Queries;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetTipologieEmergenza
{
    public class GetTipologieEmergenzaQueryHandler : IQueryHandler<GetTipologieEmergenzaQuery, GetTipologieEmergenzaResult>
    {
        private readonly IGetTipologieIntervento _getTipologieEmergenza;

        public GetTipologieEmergenzaQueryHandler(IGetTipologieIntervento getTipologieEmergenza)
        {
            _getTipologieEmergenza = getTipologieEmergenza;
        }

        public GetTipologieEmergenzaResult Handle(GetTipologieEmergenzaQuery query)
        {
            return new GetTipologieEmergenzaResult()
            {
                listaTipologie = _getTipologieEmergenza.Get()
            };
        }
    }
}
