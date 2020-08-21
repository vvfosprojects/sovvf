using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateQueryHandler : IQueryHandler<TrasferimentiChiamateQuery, TrasferimentiChiamateResult>
    {
        private readonly IGetTrasferimenti _getTrasferimenti;
        private readonly IGetUtenteById _getUtenteById;
        public TrasferimentiChiamateQueryHandler(IGetTrasferimenti getTrasferimenti, IGetUtenteById getUtenteById)
        {
            _getTrasferimenti = getTrasferimenti;
            _getUtenteById = getUtenteById;
        }

        public TrasferimentiChiamateResult Handle(TrasferimentiChiamateQuery query)
        {
            //MAPPING
            var lstTrasferimenti = _getTrasferimenti.GetAll(query.CodiceSede).Select(c => new TrasferimentoChiamataFull()
            {
                Id = c.Id,
                CodRichiesta = c.CodRichiesta,
                SedeA = "DES SEDE A",
                SedeDa = "DES SEDE DA",
                Data = c.Data,
                Operatore = _getUtenteById.GetUtenteByCodice(c.IdOperatore)
            }).ToList();

            //PAGINAZIONE
            List<TrasferimentoChiamataFull> trasferimentiPaginati = null;

            if (query.Pagination != default)
            {
                lstTrasferimenti.Reverse();
                trasferimentiPaginati = lstTrasferimenti.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = lstTrasferimenti.Count;
            }
            else trasferimentiPaginati = lstTrasferimenti;

            //ORDINAMENTO
            return new TrasferimentiChiamateResult()
            {
                DataArray = trasferimentiPaginati.OrderByDescending(c => c.Data).ToList(),
                Pagination = query.Pagination
            };
        }
    }
}
