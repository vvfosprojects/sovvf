using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class RichiestaSoccorsoAereo : Evento
    {
        public string Note { get; set; }
        public List<Activity> Activities { get; set; }

        public RichiestaSoccorsoAereo(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string note, List<Activity> activities)
            : base(richiesta, istante, codiceFonte, "RichiestaSoccorsoAereo")
        {
            Note = note;
            Activities = activities;
        }
    }
}
