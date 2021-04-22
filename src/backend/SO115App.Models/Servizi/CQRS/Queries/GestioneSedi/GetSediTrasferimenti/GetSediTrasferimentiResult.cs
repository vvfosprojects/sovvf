using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediTrasferimenti
{
    public class GetSediTrasferimentiResult
    {
        public List<Sede> DataArray { get; set; }
    }
}
