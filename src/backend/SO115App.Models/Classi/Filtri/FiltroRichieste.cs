using SO115App.API.Models.Classi.Soccorso;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltroRichieste
    {
        public List<string> Stato;
        public RichiestaAssistenza.Priorita? Priorita;
    }
}
