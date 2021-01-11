using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class RichiestaSoccorsoAereo : Evento
    {
        public RichiestaSoccorsoAereo(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte)
            : base(richiesta, istante, codiceFonte, "RichiestaSoccorsoAereo")
        {

        }
    }
}
