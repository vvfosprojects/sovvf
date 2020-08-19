using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.CodiciChiamate;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate.CodiciChiamate
{
    public class CodiciChiamateQueryHandler : IQueryHandler<CodiciChiamateQuery, CodiciChiamateResult>
    {
        private readonly IGetCodiciChiamate _getCodiciChiamate;
        public CodiciChiamateQueryHandler(IGetCodiciChiamate getCodiciChiamate) => _getCodiciChiamate = getCodiciChiamate;

        public CodiciChiamateResult Handle(CodiciChiamateQuery query)
        {
            var dataArray = _getCodiciChiamate.Get(query.CodiceSede);

            return new CodiciChiamateResult()
            {
                DataArray = dataArray
            };
        }
    }
}
