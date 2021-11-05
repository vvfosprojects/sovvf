using CQRS.Queries;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetModuliByCodComando
{
    public class GetModuliByCodComandoQueryHandler : IQueryHandler<GetModuliByCodComandoQuery, GetModuliByCodComandoResult>
    {
        private readonly IGetModuliColonnaMobileByCodComando _getModuli;

        public GetModuliByCodComandoQueryHandler(IGetModuliColonnaMobileByCodComando getModuli)
        {
            _getModuli = getModuli;
        }

        public GetModuliByCodComandoResult Handle(GetModuliByCodComandoQuery query)
        {
            var listaColonneMobili = _getModuli.Get(query.IdSede, query.NomeModulo);

            //PAGINAZIONE
            List<ModuliColonnaMobile> ListaModuliColonnaMobile = null;

            if (query.Pagination != default)
            {
                listaColonneMobili.Reverse();
                ListaModuliColonnaMobile = listaColonneMobili.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = listaColonneMobili.Count;
            }
            else ListaModuliColonnaMobile = listaColonneMobili;

            //MAPPING
            return new GetModuliByCodComandoResult()
            {
                DataArray = ListaModuliColonnaMobile,
                Pagination = query.Pagination
            };
        }
    }
}
