using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;

namespace SO115App.Persistance.Oracle.Core.Interfacce.GestioneServizi
{
    public interface IGetServizi
    {
        List<ORAServizi> GetListaServizi(string CodSede);
    }
}
