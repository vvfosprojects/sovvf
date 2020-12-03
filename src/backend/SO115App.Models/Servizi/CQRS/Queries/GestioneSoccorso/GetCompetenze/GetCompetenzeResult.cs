using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze
{
    public class GetCompetenzeResult
    {
        public List<Sede> DataArray { get; set; }
    }
}
