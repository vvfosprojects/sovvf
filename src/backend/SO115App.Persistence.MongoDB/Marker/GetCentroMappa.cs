using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Globalization;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetCentroMappa : IGetCentroMappaMarker
    {
        private readonly IGetCoordinateByCodSede _service;
        private readonly IGetStringCoordinateByCodSede _getStringCoordinateByCodSede;

        public GetCentroMappa(IGetCoordinateByCodSede service,
                              IGetStringCoordinateByCodSede getStringCoordinateByCodSede)
        { 
            _service = service;
            _getStringCoordinateByCodSede = getStringCoordinateByCodSede;
        }


        public CentroMappa GetCentroMappaMarker(string codiceSede)
        {
            //var coordinate = _service.Get(codiceSede);
            var coordinate = _getStringCoordinateByCodSede.Get(codiceSede);
            //coordinate.Latitudine = Convert.ToDouble(coordinate.Latitudine);
            //coordinate.Longitudine = Convert.ToDouble(coordinate.Longitudine);

            var centroMappa = new CentroMappa()
            {
                CoordinateCentro = coordinate,
                Zoom = 10
            };

            return centroMappa;
        }
    }
}
