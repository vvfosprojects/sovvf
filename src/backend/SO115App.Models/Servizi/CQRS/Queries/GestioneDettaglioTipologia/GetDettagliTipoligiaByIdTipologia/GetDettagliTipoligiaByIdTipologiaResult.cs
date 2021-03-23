using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia.GetDettagliTipoligiaByIdTipologia
{
    public class GetDettagliTipoligiaByIdTipologiaResult
    {
        public List<TipologiaDettaglio> listaDettaglioTipologie { get; set; }
    }
}
