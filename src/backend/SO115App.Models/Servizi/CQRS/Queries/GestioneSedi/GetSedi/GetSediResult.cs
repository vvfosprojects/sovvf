using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSedi
{
    public class GetSediResult
    {
        public List<Sede> DataArray { get; set; }
    }
}
