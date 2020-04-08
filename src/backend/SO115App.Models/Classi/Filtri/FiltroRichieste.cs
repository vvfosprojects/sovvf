using System;
using System.Collections.Generic;
using System.Text;
using SO115App.API.Models.Classi.Soccorso;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltroRichieste
    {
        public List<string> Stato;
        public RichiestaAssistenza.Priorita? Priorita;
    }
}
