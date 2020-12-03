using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze
{
    public class GetCompetenzeQuery : IQuery<GetCompetenzeResult>
    {
        public string IdOperatore { get; set; }
        public string[] CodiciSede { get; set; }

        public Coordinate Coordinate { get; set; }
    }
}
