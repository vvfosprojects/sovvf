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
        public GetCentroMappa(IGetCoordinateByCodSede service) => _service = service;

        public CentroMappa GetCentroMappaMarker(string codiceSede)
        {
            var coordinate = _service.Get(codiceSede);

            coordinate.Latitudine = Convert.ToDouble(coordinate.Latitudine, new CultureInfo("en-US"));
            coordinate.Longitudine = Convert.ToDouble(coordinate.Longitudine, new CultureInfo("en-US"));


            var centroMappa = new CentroMappa()
            {
                CoordinateCentro = coordinate,
                Zoom = 10
            };

            return centroMappa;
        }
    }
}
