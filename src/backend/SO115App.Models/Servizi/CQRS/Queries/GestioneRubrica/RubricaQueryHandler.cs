using CQRS.Queries;
using Microsoft.AspNetCore.JsonPatch.Internal;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using System.Collections.Generic;
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
            List<EnteDTO> rubricaPaginata = null;

            if (query.Pagination != default)
            {
                listaRubrica.Reverse();
                rubricaPaginata = listaRubrica.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = listaRubrica.Count;
            }
            else rubricaPaginata = listaRubrica;

            //MAPPING
            return new RubricaResult()
            {
                DataArray = rubricaPaginata,
                Pagination = query.Pagination
            };
        }
    }
}
