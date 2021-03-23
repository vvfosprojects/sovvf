﻿using SO115App.Models.Classi.Triage;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage
{
    public class AddTriageCommand
    {
        public int CodTipologia { get; set; }
        public int CodDettaglioTipologia { get; set; }
        public Triage Triage { get; set; }
        public List<TriageData> ListaTriageData { get; set; }
    }
}
