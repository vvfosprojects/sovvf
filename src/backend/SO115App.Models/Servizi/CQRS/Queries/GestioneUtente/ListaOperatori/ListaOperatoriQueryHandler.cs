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
            var utenti = _getUtenti.Get(query.CodiceSede, query.Filters.Search);
            var utentiPaginati = utenti.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).Reverse().ToList();
            query.Pagination.TotalItems = utenti.Count;
            return new ListaOperatoriResult
            {
                DataArray = utentiPaginati,
                Pagination = query.Pagination
            };
        }
    }
}
