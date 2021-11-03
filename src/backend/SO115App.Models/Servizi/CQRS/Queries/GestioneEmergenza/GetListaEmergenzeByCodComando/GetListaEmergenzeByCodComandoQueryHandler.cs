using CQRS.Queries;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetListaEmergenzeByCodComando
{
    public class GetListaEmergenzeByCodComandoQueryHandler : IQueryHandler<GetListaEmergenzeByCodComandoQuery, GetListaEmergenzeByCodComandoResult>
    {
        private readonly IGetEmergenzeByCodComando _getEmergenze;

        public GetListaEmergenzeByCodComandoQueryHandler(IGetEmergenzeByCodComando getEmergenze)
        {
            _getEmergenze = getEmergenze;
        }

        public GetListaEmergenzeByCodComandoResult Handle(GetListaEmergenzeByCodComandoQuery query)
        {
            var listaEmergenze = _getEmergenze.Get(query.IdSede[0]);

            //PAGINAZIONE
            List<Emergenza> ListaEmergenzePaginata = null;

            if (query.Pagination != default)
            {
                listaEmergenze.Reverse();
                ListaEmergenzePaginata = listaEmergenze.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = listaEmergenze.Count;
            }
            else ListaEmergenzePaginata = listaEmergenze;

            //MAPPING
            return new GetListaEmergenzeByCodComandoResult()
            {
                DataArray = ListaEmergenzePaginata,
                Pagination = query.Pagination
            };
        }
    }
}
