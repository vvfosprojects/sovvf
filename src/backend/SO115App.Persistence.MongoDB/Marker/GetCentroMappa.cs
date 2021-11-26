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
            var centroMappa = new CentroMappa();

            if (!codiceSede.Equals("00"))
            {
                var coordinate = _getStringCoordinateByCodSede.Get(codiceSede);
                centroMappa = new CentroMappa()
                {
                    CoordinateCentro = coordinate,
                    Zoom = 10
                };
            }
            else
            {
                string[] coordinate = new string[2] { "42.28313392189123", "11.682171591796926" };
                centroMappa = new CentroMappa()
                {
                    CoordinateCentro = coordinate,
                    Zoom = 6
                };
            }

            return centroMappa;
        }
    }
}
