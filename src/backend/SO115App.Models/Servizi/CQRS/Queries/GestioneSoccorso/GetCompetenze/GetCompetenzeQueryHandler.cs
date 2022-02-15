using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze
{
    public class GetCompetenzeQueryHandler : IQueryHandler<GetCompetenzeQuery, GetCompetenzeResult>
    {
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetSedi _getSede;

        public GetCompetenzeQueryHandler(IGetCompetenzeByCoordinateIntervento getCompetenze, IGetSedi getSede)
        {
            _getCompetenze = getCompetenze;
            _getSede = getSede;
        }

        public GetCompetenzeResult Handle(GetCompetenzeQuery query)
        {
            var lstCodiciCompetenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(query.Coordinate);

            var lstCompetenze = lstCodiciCompetenze.MapCompetenze(_getSede);

            return new GetCompetenzeResult()
            {
                DataArray = lstCompetenze
            };
        }
    }
}
