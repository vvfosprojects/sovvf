using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia
{
    public class DettaglioTipologiaResult
    {
        public List<TipologiaDettaglio> DataArray { get; set; }
        public Paginazione Pagination { get; set; }
    }
}
