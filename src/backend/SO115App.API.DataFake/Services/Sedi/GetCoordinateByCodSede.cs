using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.DataFake.Services.Sedi
{
    public class GetCoordinateByCodSede
    {
        private readonly IGetCoordinateByCodSede _getCoordinate;

        public GetCoordinateByCodSede(IGetCoordinateByCodSede getCoordinate)
        {
            this._getCoordinate = getCoordinate;
        }

        public Coordinate Get(string codSede) 
        {
            return _getCoordinate.Get(codSede);
        
        }
    }
}
