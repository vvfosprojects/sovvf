using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Persistence.MongoDB.GestioneSedi;
using System;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetCentroMappa : IGetCentroMappaMarker
    {
        private readonly DbContext _context;

        public GetCentroMappa(DbContext context)
        {
            this._context = context;
        }

        public CentroMappa GetCentroMappaMarker(string codiceSede)
        {
            if (!codiceSede.Equals("CON"))
            {
                GetCoordinateByCodSede getCoordinate = new GetCoordinateByCodSede(_context);

                var coordinate = getCoordinate.Get(codiceSede);

                CentroMappa centroMappa = new CentroMappa()
                {
                    CoordinateCentro = coordinate,
                    Zoom = 10
                };

                return centroMappa;
            }
            else
            {
                Coordinate coordinate = new Coordinate(41.87194, 12.56738);

                CentroMappa centroMappa = new CentroMappa()
                {
                    CoordinateCentro = coordinate,
                    Zoom = 6
                };

                return centroMappa;
            }
        }
    }
}
