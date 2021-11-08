using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ServiziEsterni.AFM;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoCommand
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public Classi.ServiziEsterni.AFM.AnnullaRichiestaAFM Annullamento { get; set; }

        /// <summary>
        /// Codice richiesta
        /// </summary>
        public string CodiceRichiesta { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }

        public InfoAFM ResponseAFM { get; set; }
    }
}
