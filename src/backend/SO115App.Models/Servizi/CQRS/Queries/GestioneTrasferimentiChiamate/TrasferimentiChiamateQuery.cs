using CQRS.Queries;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateQuery : IQuery<TrasferimentiChiamateResult>
    {
        public string CodiceSede { get; set; }
        public string IdOperatore { get; set; }
        public Paginazione Pagination { get; set; }
    }
}
