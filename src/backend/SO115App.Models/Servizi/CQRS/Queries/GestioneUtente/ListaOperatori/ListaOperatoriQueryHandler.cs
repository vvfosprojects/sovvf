using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    public class ListaOperatoriQueryHandler : IQueryHandler<ListaOperatoriQuery, ListaOperatoriResult>
    {
        private readonly IGetUtenti _getUtenti;

        public ListaOperatoriQueryHandler(IGetUtenti getUtenti)
        {
            _getUtenti = getUtenti;
        }

        public ListaOperatoriResult Handle(ListaOperatoriQuery query)
        {
            var utentiPaginati = _getUtenti.Get(query.CodiceSede, query.Filters.Search).Skip(query.Pagination.Page - 1).Take(query.Pagination.PageSize).ToList();
            query.Pagination.Count = utentiPaginati.Count;
            return new ListaOperatoriResult
            {
                DataArray = utentiPaginati,
                Pagination = query.Pagination
            };
        }
    }
}
