using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.Models.Classi.Composizione
{
   public class ConfermaPartenze
    {
        public List<Partenza> Partenze { get; set; }

        public string IdRichiesta { get; set; }

        public string Turno { get; set; }

        public SintesiRichieste Chiamata { get; set; }

        public string CodiceSede { get; set; }

        public RichiestaAssistenza richiesta { get; set; }
    }
}
