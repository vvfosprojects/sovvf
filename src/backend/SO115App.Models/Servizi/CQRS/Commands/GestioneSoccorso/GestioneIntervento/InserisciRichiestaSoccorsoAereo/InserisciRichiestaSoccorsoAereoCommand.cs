using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommand
    {
        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }

        public NuovaRichiestaSoccorsoAereo RichiestaSoccorsoAereo { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }

        public ErroreRichiestaSoccorsoAereo ErroriAFM { get; set; }
    }
}
