using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.ServiziEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri
{
    public interface IMapperSintesiInSchedeSO115
    {
        public List<SchedaSO115> Map(SintesiRichiesta listasintesi);
    }
}
