using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ServiziEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommand
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public NuovaRichiestaAFM RichiestaSoccorsoAereo { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }

        public InfoAFM ResponseAFM { get; set; }
    }
}
