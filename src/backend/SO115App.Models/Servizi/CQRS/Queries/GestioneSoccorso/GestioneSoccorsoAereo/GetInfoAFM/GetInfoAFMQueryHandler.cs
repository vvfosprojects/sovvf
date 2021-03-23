using CQRS.Queries;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetInfoAFM
{
    public class GetInfoAFMQueryHandler : IQueryHandler<GetInfoAFMQuery, GetInfoAFMResult>
    {
        private readonly IGetInfoRichiestaSoccorsoAereo _getinfo;

        public GetInfoAFMQueryHandler(IGetInfoRichiestaSoccorsoAereo getinfo)
        {
            _getinfo = getinfo;
        }

        public GetInfoAFMResult Handle(GetInfoAFMQuery query)
        {
            var requestKey = MapRequestKeyAFM.MapForAFM(query.RequestKey);

            var result = _getinfo.Get(requestKey);

            return new GetInfoAFMResult()
            {
                Data = result
            };
        }
    }
}
