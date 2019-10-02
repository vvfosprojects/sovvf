using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    public interface IGetCoordinateFromGeoFleet
    {
        Coordinate CodificaLocalizzazione(CoordinateGeoFleet localizzazione);
    }
}
