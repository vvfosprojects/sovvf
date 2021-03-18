using SO115App.Models.Classi.ServiziEsterni.AFM;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetTipologieSoccorsoAereo
{
    public class GetTipologieSoccorsoAereoResult
    {
        public List<TipologiaSoccorsoAereo> DataArray { get; set; }
    }
}
