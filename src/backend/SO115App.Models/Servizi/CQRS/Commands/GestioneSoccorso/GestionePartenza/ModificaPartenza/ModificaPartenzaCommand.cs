using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommand
    {
        public string CodSede { get; set; }
        public string IdOperatore { get; set; }

        public string CodRichiesta { get; set; }
        public string[] IdSquadre { get; set; }
        public string CodMezzo { get; set; }
        public string Motivazione { get; set; }
        public DateTime DataAnnullamento { get; set; }
        public List<Evento> lstEventi { get; set; }
    }
}
