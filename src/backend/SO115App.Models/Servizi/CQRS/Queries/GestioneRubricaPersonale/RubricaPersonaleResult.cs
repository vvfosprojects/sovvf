using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubricaPersonale
{
    public class RubricaPersonaleResult
    {
        public List<PersonaleRubrica> DataArray { get; set; }
        public Paginazione Pagination { get; set; }
    }
}