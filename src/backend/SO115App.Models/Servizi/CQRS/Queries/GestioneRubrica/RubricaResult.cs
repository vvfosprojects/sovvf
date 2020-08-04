using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaResult
    {
        public List<EnteDTO> Rubrica { get; set; }
        public Paginazione Pagination { get; set; }
    }
}
