using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaResult
    {
        public List<EnteIntervenuto> Rubrica { get; set; }
    }
}
