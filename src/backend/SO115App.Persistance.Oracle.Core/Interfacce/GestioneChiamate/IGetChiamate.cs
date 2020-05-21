using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;

namespace SO115App.Persistance.Oracle.Core.Interfacce.GestioneChiamate
{
    public interface IGetChiamate
    {
        List<ORAChiamate> GetListaChiamate(string CodSede);
    }
}
