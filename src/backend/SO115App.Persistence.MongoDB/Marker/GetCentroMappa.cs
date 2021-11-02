using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetCentroMappa : IGetCentroMappaMarker
    {
        public CentroMappa GetCentroMappaMarker(string codiceSede)
        {
            if (!codiceSede.Equals("CON"))
            {
                var coordinate = new Coordinate(0.0, 0.0);

                var centroMappa = new CentroMappa()
                {
                    CoordinateCentro = coordinate,
                    Zoom = 10
                };

                return centroMappa;
            }
            else
            {
                var coordinate = new Coordinate(41.87194, 12.56738);

                var centroMappa = new CentroMappa()
                {
                    CoordinateCentro = coordinate,
                    Zoom = 6
                };

                return centroMappa;
            }
        }
    }
}
