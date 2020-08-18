using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateResult
    {
        public List<TrasferimentoChiamata> DataArray { get; set; }
        public Paginazione Pagination { get; set; }
    }
}
