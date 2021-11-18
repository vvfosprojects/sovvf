using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface IGetInterventiInProssimita
    {
        List<SintesiRichiesta> Get(Coordinate coordinate, HashSet<PinNodo> CodComando);
    }
}
