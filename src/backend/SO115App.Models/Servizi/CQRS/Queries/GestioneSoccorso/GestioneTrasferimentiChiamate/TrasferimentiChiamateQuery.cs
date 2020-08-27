using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateQuery : IQuery<TrasferimentiChiamateResult>
    {
        public string CodiceSede { get; set; }
        public string IdOperatore { get; set; }
        public Paginazione Pagination { get; set; }
        public FiltroTrasferimenti Filters { get; set; }
    }
}
