﻿using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ConfermaPartenze
    {
        public List<Partenza> Partenze { get; set; }
        public string IdRichiesta { get; set; }
        public string Turno { get; set; }
        public string IdRichiestaDaSganciare { get; set; }
        public string IdMezzoDaSganciare { get; set; }
        public SintesiRichiesta Chiamata { get; set; }
        public string CodiceSede { get; set; }
        public RichiestaAssistenza richiesta { get; set; }
        public string IdOperatore { get; set; }
    }
}
