using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia.GetDettagliTipoligiaByIdTipologia;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie
{
    public interface IGetListaDettagliTipologieByIdTipologia
    {
        public List<TipologiaDettaglio> Get(GetDettagliTipoligiaByIdTipologiaQuery query);
    }
}
