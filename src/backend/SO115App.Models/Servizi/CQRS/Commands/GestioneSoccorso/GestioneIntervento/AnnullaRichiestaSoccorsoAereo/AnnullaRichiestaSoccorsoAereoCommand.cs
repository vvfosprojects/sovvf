using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoCommand
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public Classi.ServiziEsterni.AFM.AnnullaRichiestaSoccorsoAereo Annullamento { get; set; }

        /// <summary>
        /// Codice richiesta
        /// </summary>
        public string Codice { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }

        public ErroreRichiestaSoccorsoAereo ErroriAFM { get; set; }
    }
}
