using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.FakePersistence.JSon.ServiziEsterni.GeoFleet
{
    public class GetInRettangolo : IGetInRettangolo
    {
        List<Mezzo> IGetInRettangolo.GetInRettangolo(double lat1, double lon1, double lat2, double lon2, int attSec)
        {
            return null;
        }
    }
}
