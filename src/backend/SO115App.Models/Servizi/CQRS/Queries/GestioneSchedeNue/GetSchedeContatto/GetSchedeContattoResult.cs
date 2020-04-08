using SO115App.Models.Classi.NUE;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto
{
    public class GetSchedeContattoResult
    {
        public List<SchedaContatto> SchedeContatto { get; set; }
    }
}
