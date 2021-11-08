using SO115App.Models.Classi.ServiziEsterni.AFM;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo
{
    public class GetCategorieSoccorsoAereoResult
    {
        public List<CategoriaAFM> DataArray { get; set; }
    }
}
