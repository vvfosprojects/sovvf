﻿using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommand
    {
        public string CodSede { get; set; }
        public string IdOperatore { get; set; }
        public Classi.Composizione.ModificaPartenza ModificaPartenza { get; set; }
        public RichiestaAssistenza Richiesta { get; set; }
    }
}
