using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Partenze
{
    public class MezzoRiassegnato : AbstractPartenza
    {
        public string Note { get; set; }

        public MezzoRiassegnato(RichiestaAssistenza richiesta, string codiceMezzo, DateTime istante, string codiceFonte, string TipoEvento, string CodicePartenza, string note)
            : base(richiesta, codiceMezzo, istante, codiceFonte, TipoEvento, CodicePartenza)
        {
            Note = note;
        }

        public override IStatoMezzo Visit(ICanAcceptVisitorStatoMezzo stato)
        {
            throw new NotImplementedException();
        }
    }
}
