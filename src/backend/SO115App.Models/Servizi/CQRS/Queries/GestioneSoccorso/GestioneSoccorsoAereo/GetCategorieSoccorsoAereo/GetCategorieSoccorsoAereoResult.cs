using SO115App.Models.Classi.ServiziEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo
{
    public class GetCategorieSoccorsoAereoResult
    {
        public List<CategoriaSoccorsoAereo> DataArray { get; set; }
    }
}
