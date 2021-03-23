using SO115App.Models.Classi.NUE;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto
{
    public class GetSchedeContattoResult
    {
        public List<SchedaContatto> SchedeContatto { get; set; }
    }
}
