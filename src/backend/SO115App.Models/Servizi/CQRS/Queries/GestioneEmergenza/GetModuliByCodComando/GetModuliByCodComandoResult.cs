using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Emergenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetModuliByCodComando
{
    public class GetModuliByCodComandoResult
    {
        public List<ModuliColonnaMobile> DataArray { get; set; }
        public Paginazione Pagination { get; set; }
    }
}
