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

        public string CodiceRichiesta { get; set; }
        public string Motivazione { get; set; }
    }
}
