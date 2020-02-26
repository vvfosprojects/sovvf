using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    public interface IGetSchedeContattoMarkerFiltered
    {
        List<SchedaContattoMarker> Get(AreaMappa area, string codSede);
    }
}
