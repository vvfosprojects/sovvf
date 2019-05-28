using SO115App.API.Models.Classi.Marker;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Marker
{
    public interface IGetMezziMarker
    {
        List<SintesiMezzoMarker> GetListaMezziMarker();
    }
}
