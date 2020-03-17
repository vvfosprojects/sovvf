using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.DataFake.Services.Sedi
{
    public class GetCompetenzeByCoordinateIntervento
    {
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;

        public GetCompetenzeByCoordinateIntervento(IGetCompetenzeByCoordinateIntervento getCompetenze)
        {
            this._getCompetenze = getCompetenze;
        }

        public CompetenzeRichiesta Get(Coordinate coordinate)
        {
            return _getCompetenze.GetCompetenzeByCoordinateIntervento(coordinate);

        }
    }
}
