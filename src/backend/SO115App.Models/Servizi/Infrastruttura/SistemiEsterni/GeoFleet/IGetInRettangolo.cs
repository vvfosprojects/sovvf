using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    internal interface IGetInRettangolo
    {
        List<Mezzo> GetInRettangolo(double lat1, double lon1, double lat2, double lon2, int attSec);
    }
}
