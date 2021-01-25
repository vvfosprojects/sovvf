using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class RichiestaSoccorsoAereo : Evento
    {
        public string Note { get; set; }
        public string Targa { get; set; }

        public RichiestaSoccorsoAereo(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string note, string targaVeivolo)
            : base(richiesta, istante, codiceFonte, "RichiestaSoccorsoAereo")
        {
            Note = note;
            Targa = targaVeivolo;
        }
    }
}
