using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;
using SO115App.Models.Servizi.Infrastruttura.Utility;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage
{
    public class GetTriageQueryHandler : IQueryHandler<GetTriageQuery, GetTriageResult>
    {
        private readonly IGetTriage _getTriage;
        private readonly IGetTriageData _getTriageData;
        private readonly IGetSottoSediByCodSede _getSottoSedi;

        public GetTriageQueryHandler(IGetTriage getTriage, IGetTriageData getTriageData, IGetSottoSediByCodSede getSottoSedi)
        {
            _getTriage = getTriage;
            _getTriageData = getTriageData;
            _getSottoSedi = getSottoSedi;
        }

        public GetTriageResult Handle(GetTriageQuery query)
        {
            var lstSedi = _getSottoSedi.Get(query.CodiceSede);

            query.CodiceSede = lstSedi.ToArray();

            return new GetTriageResult()
            {
                Triage = _getTriage.GetTriage(query),
                TriageData = _getTriageData.GetTriageData(query)
            };
        }
    }
}
