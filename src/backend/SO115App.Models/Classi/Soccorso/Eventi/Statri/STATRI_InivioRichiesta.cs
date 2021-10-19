using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Statri
{
    public class STATRI_InivioRichiesta : Evento
    {
        public STATRI_InivioRichiesta(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string messaggio)
            : base(richiesta, istante, codiceFonte, "STATRI_InivioRichiesta")
        {
            Messaggio = messaggio;
        }

        public string Messaggio { get; set; }
    }
}
