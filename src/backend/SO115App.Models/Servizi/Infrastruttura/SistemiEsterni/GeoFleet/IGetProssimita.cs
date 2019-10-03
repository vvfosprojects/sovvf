using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    internal interface IGetProssimita
    {
        List<Mezzo> GetProssimita(float lat, float lon, float maxRadius, List<string> classiMezzo, int attSec);
    }
}
