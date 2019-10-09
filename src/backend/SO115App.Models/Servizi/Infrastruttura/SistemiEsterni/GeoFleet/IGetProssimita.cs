using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    public interface IGetProssimita
    {
        List<ProssimitaMezzo> Get(float lat, float lon, float maxRadius, List<string> classiMezzo, int attSec);
    }
}
