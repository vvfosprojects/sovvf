using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediAllerta
{
    public class GetSediAllertaResult
    {
        public List<Sede> DataArray { get; set; }
    }
}
