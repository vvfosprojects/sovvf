﻿using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.ModificaDettaglioTipologia
{
    public class ModifyDettaglioTipologiaCommand
    {
        public string[] CodiceSede { get; set; }
        public string idOperatore { get; set; }
        public TipologiaDettaglio DettaglioTipologia { get; set; }
    }
}
