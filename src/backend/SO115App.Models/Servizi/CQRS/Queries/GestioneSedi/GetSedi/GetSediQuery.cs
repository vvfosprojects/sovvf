using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSedi
{
    public class GetSediQuery : IQuery<GetSediResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdUtente { get; set; }
    }
}
