using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage
{
    public class GetTriageQueryHandler : IQueryHandler<GetTriageQuery, GetTriageResult>
    {
        private readonly IGetTriage _getTriage;
        private readonly IGetTriageData _getTriageData;

        public GetTriageQueryHandler(IGetTriage getTriage, IGetTriageData getTriageData)
        {
            _getTriage = getTriage;
            _getTriageData = getTriageData;
        }

        public GetTriageResult Handle(GetTriageQuery query)
        {
            return new GetTriageResult()
            {
                Triage = _getTriage.GetTriage(query),
                TriageData = _getTriageData.GetTriageData(query)
            };
        }
    }
}
