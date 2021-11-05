using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetCentroMappa : IGetCentroMappaMarker
    {
        private readonly IGetCoordinateByCodSede _service;
        public GetCentroMappa(IGetCoordinateByCodSede service) => _service = service;

        public CentroMappa GetCentroMappaMarker(string codiceSede)
        {
            var coordinate = _service.Get(codiceSede);

            var centroMappa = new CentroMappa()
            {
                CoordinateCentro = coordinate,
                Zoom = 10
            };

            return centroMappa;
        }
    }
}
