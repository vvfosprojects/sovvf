using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface IGetRichiesteAssistenza
    {
        IEnumerable<RichiestaAssistenza> GetRichieste();
    }
}
