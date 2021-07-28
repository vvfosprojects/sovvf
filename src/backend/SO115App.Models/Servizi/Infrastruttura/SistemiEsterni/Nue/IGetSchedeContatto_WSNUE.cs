using SO115App.Models.Classi.NUE;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    public interface IGetSchedeContatto_WSNUE
    {
        List<SchedaContatto> GetAllSchedeContatto(string CodiceSede);
    }
}
