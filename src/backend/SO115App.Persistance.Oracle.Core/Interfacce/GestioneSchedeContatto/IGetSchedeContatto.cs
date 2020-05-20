using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;

namespace SO115App.Persistance.Oracle.Core.Interfacce.GestioneSchedeContatto
{
    public interface IGetSchedeContatto
    {
        List<ORASchedaContatto> GetListaSchedeContatto(string CodSede);
    }
}
