using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;

namespace SO115App.Persistence.Oracle.Infrastruttura
{
    public interface IGetChiamate
    {
        List<ORAChiamate> GetListaChiamate(string CodSede);
    }
}
