using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia
{
    public class DettaglioTipologiaQueryHandler : IQueryHandler<DettaglioTipologiaQuery, DettaglioTipologiaResult>
    {
        private readonly IGetListaDettaglioTipologia _getDettaglioTipologia;

        public DettaglioTipologiaQueryHandler(IGetListaDettaglioTipologia getDettaglioTipologia)
        {
            _getDettaglioTipologia = getDettaglioTipologia;
        }

        public DettaglioTipologiaResult Handle(DettaglioTipologiaQuery query)
        {
            var listaDettagliTipologia = _getDettaglioTipologia.Get(query);

            //PAGINAZIONE
            List<TipologiaDettaglio> DettagliTipologiaPaginata = null;

            if (query.Pagination != default)
            {
                listaDettagliTipologia.Reverse();
                DettagliTipologiaPaginata = listaDettagliTipologia.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = listaDettagliTipologia.Count;
            }
            else DettagliTipologiaPaginata = listaDettagliTipologia;

            //MAPPING
            return new DettaglioTipologiaResult()
            {
                DataArray = DettagliTipologiaPaginata,
                Pagination = query.Pagination
            };
        }
    }
}
