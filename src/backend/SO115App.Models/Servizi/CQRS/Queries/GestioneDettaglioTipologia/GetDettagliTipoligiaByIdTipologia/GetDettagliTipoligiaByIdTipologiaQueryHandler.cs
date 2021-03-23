using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia.GetDettagliTipoligiaByIdTipologia
{
    public class GetDettagliTipoligiaByIdTipologiaQueryHandler : IQueryHandler<GetDettagliTipoligiaByIdTipologiaQuery, GetDettagliTipoligiaByIdTipologiaResult>
    {
        private readonly IGetListaDettagliTipologieByIdTipologia _getDettaglioTipologia;

        public GetDettagliTipoligiaByIdTipologiaQueryHandler(IGetListaDettagliTipologieByIdTipologia getDettaglioTipologia)
        {
            _getDettaglioTipologia = getDettaglioTipologia;
        }

        public GetDettagliTipoligiaByIdTipologiaResult Handle(GetDettagliTipoligiaByIdTipologiaQuery query)
        {
            return new GetDettagliTipoligiaByIdTipologiaResult()
            {
                listaDettaglioTipologie = _getDettaglioTipologia.Get(query)
            };
        }
    }
}
