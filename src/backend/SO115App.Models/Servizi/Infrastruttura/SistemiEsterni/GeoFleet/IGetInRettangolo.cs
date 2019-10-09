using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    public interface IGetInRettangolo
    {
        List<MessaggioPosizione> Get(double lat1, double lon1, double lat2, double lon2, int attSec);
    }
}
