using CQRS.Commands;
using System;
using System.Collections.Generic;
using System.Text;

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
    }
}
