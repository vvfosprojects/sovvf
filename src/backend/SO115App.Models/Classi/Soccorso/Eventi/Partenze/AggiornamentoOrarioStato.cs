﻿using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Partenze
{
    public class AggiornamentoOrarioStato : AbstractPartenza
    {
        public AggiornamentoOrarioStato(RichiestaAssistenza richiesta, string codiceMezzo, DateTime istante, string codiceFonte, string TipoEvento, string CodicePartenza)
            : base(richiesta, codiceMezzo, istante, codiceFonte, TipoEvento, CodicePartenza)
        {
        }

        public DateTime VecchioIstante { get; set; }
        public string Note { get; set; }

        public override IStatoMezzo Visit(ICanAcceptVisitorStatoMezzo stato)
        {
            throw new NotImplementedException();
        }
    }
}
