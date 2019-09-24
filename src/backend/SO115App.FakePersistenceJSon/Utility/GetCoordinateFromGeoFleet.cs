using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class GetCoordinateFromGeoFleet : IGetCoordinateFromGeoFleet
    {
        public Coordinate CodificaLocalizzazione(CoordinateGeoFleet localizzazione)
        {
            return new Coordinate((localizzazione.Lat),
                (localizzazione.Lon));
        }
    }
}
