using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface IRicercaFullText
    {
        List<SintesiRichiesta> GetListaSintesi(string[] CodSede, string TextToSearch);
    }
}
