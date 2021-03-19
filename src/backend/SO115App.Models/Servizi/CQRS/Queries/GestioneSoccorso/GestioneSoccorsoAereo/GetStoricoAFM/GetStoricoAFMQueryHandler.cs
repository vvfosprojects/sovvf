using CQRS.Queries;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoAFM
{
    public class GetInfoAFMQueryHandler : IQueryHandler<GetStoricoAFMQuery, GetStoricoAFMResult>
    {
        private readonly IGetHistoryRichiestaSoccorsoAereo _getHistoryRichiestaSoccorsoAereo;

        public GetInfoAFMQueryHandler(IGetHistoryRichiestaSoccorsoAereo getHistoryRichiestaSoccorsoAereo)
        {
            _getHistoryRichiestaSoccorsoAereo = getHistoryRichiestaSoccorsoAereo;
        }

        public GetStoricoAFMResult Handle(GetStoricoAFMQuery query)
        {
            var requestKey = MapRequestKeyAFM.MapForAFM(query.RequestKey);

            var result = _getHistoryRichiestaSoccorsoAereo.Get(requestKey);

            return new GetStoricoAFMResult()
            {
                Data = result
            };
        }
    }
}
