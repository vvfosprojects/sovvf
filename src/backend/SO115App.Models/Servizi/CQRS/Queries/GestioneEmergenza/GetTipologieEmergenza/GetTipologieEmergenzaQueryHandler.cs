using CQRS.Queries;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetTipologieEmergenza
{
    public class GetTipologieEmergenzaQueryHandler : IQueryHandler<GetTipologieEmergenzaQuery, GetTipologieEmergenzaResult>
    {
        private readonly IGetTipologieIntervento _getTipologieEmergenza;

        public GetTipologieEmergenzaQueryHandler(IGetTipologieIntervento getTipologieEmergenza)
        {
            _getTipologieEmergenza = getTipologieEmergenza;
        }

        public GetTipologieEmergenzaResult Handle(GetTipologieEmergenzaQuery query)
        {
            var listaTipologie = _getTipologieEmergenza.Get();

            //PAGINAZIONE
            List<TipologiaEmergenza> ListaTipologiePaginata = null;

            if (query.Pagination != default)
            {
                listaTipologie.Reverse();
                ListaTipologiePaginata = listaTipologie.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = listaTipologie.Count;
            }
            else ListaTipologiePaginata = listaTipologie;

            //MAPPING
            return new GetTipologieEmergenzaResult()
            {
                DataArray = ListaTipologiePaginata,
                Pagination = query.Pagination
            };
        }
    }
}
