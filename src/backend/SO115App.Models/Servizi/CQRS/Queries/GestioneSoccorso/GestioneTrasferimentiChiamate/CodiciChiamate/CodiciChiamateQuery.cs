using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTrasferimentiChiamate.CodiciChiamate
{
    public class CodiciChiamateQuery : IQuery<CodiciChiamateResult>
    {
        public string CodiceSede { get; set; }
        public string IdOperatore { get; set; }
    }
}
