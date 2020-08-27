using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate
{
    public interface IGetTrasferimenti
    {
        List<TrasferimentoChiamata> GetAll(string[] CodiciSedi, FiltroTrasferimenti filters);
        int Count(string[] CodiciSedi);
    }
}
