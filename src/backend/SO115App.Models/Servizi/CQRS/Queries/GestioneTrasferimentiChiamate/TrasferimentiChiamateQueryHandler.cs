using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateQueryHandler : IQueryHandler<TrasferimentiChiamateQuery, TrasferimentiChiamateResult>
    {
        private readonly IGetTrasferimenti _getTrasferimenti;
        public TrasferimentiChiamateQueryHandler(IGetTrasferimenti getTrasferimenti) => _getTrasferimenti = getTrasferimenti;

        public TrasferimentiChiamateResult Handle(TrasferimentiChiamateQuery query)
        {
            var lstTrasferimenti = _getTrasferimenti.GetAll(query.CodiceSede);

            //PAGINAZIONE
            List<TrasferimentoChiamata> trasferimentiPaginati = null;

            if (query.Pagination != default)
            {
                lstTrasferimenti.Reverse();
                trasferimentiPaginati = lstTrasferimenti.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = lstTrasferimenti.Count;
            }
            else trasferimentiPaginati = lstTrasferimenti;

            //MAPPING
            return new TrasferimentiChiamateResult()
            {
                DataArray = trasferimentiPaginati,
                Pagination = query.Pagination
            };
        }
    }
}
