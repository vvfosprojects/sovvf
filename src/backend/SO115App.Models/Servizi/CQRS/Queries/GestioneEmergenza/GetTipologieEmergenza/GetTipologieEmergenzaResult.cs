using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Emergenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetTipologieEmergenza
{
    public class GetTipologieEmergenzaResult
    {
        public List<TipologiaEmergenza> DataArray { get; set; }
        public Paginazione Pagination { get; set; }
    }
}
