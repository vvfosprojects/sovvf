using SO115App.API.Models.Classi.Marker;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Marker
{
    public interface IGetSediMarker
    {
        List<SintesiSedeMarker> GetListaSediMarker();

    }
}
