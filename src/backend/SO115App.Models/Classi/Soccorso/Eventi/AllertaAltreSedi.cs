﻿using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class AllertaSedi : Evento
    {
        public AllertaSedi(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string tipoEvento, string[] codSedeAllertata)
            : base(richiesta, istante, codiceFonte, "Allerta")
        {
            TipoEvento = tipoEvento;
            CodiceSediAllertate = codSedeAllertata;
        }

        public string[] CodiceSediAllertate { get; set; }
    }
}
