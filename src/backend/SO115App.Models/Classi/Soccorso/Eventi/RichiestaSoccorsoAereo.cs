using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class RichiestaSoccorsoAereo : AbstractPartenza
    {
        public string Note { get; set; }
        public string Targa { get; set; }

        public RichiestaSoccorsoAereo(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string note, string targaVeivolo, string codicePartenza = "")
            : base(richiesta, targaVeivolo, istante, codiceFonte, "RichiestaSoccorsoAereo", codicePartenza)
        {
            Note = note;
            Targa = targaVeivolo;
        }

        public override IStatoMezzo Visit(ICanAcceptVisitorStatoMezzo stato)
        {
            throw new NotImplementedException();
        }
    }
}
