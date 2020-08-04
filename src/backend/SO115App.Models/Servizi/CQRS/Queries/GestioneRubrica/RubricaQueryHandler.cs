using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQueryHandler : IQueryHandler<RubricaQuery, RubricaResult>
    {
        private readonly IGetRubrica _getRurbica;

        public RubricaQueryHandler(IGetRubrica getRurbica)
        {
            _getRurbica = getRurbica;
        }

        public RubricaResult Handle(RubricaQuery query)
        {
            var listaRubrica = _getRurbica.Get(query.IdSede, query.Search);

            //PAGINAZIONE
            listaRubrica.Reverse();
            var RubricaPaginata = listaRubrica.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
            query.Pagination.TotalItems = listaRubrica.Count;

            //MAPPING
            return new RubricaResult()
            {
                Rubrica = RubricaPaginata
            };
        }
    }
}
