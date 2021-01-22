using CQRS.Queries;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoRichiestaSoccorsoAereo
{
    public class GetStoricoRichiestaSoccorsoAereoQueryHandler : IQueryHandler<GetStoricoRichiestaSoccorsoAereoQuery, GetStoricoRichiestaSoccorsoAereoResult>
    {
        private readonly IGetHistoryRichiestaSoccorsoAereo _getHistoryRichiestaSoccorsoAereo;

        public GetStoricoRichiestaSoccorsoAereoQueryHandler(IGetHistoryRichiestaSoccorsoAereo getHistoryRichiestaSoccorsoAereo)
        {
            _getHistoryRichiestaSoccorsoAereo = getHistoryRichiestaSoccorsoAereo;
        }

        public GetStoricoRichiestaSoccorsoAereoResult Handle(GetStoricoRichiestaSoccorsoAereoQuery query)
        {
            var requestKey = MapRequestKeyAFM.MapForAFM(query.RequestKey);

            var result = _getHistoryRichiestaSoccorsoAereo.Get(requestKey);

            return new GetStoricoRichiestaSoccorsoAereoResult()
            {
                Data = result
            };
        }
    }
}
