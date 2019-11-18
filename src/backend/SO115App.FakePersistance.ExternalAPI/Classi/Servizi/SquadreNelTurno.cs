using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Servizi
{
    public class SquadreNelTurno
    {
        public string Codice { get; set; }
        public string Nome { get; set; }

        public string CodiceSede { get; set; }

        public List<Squadra> ListaSquadre { get; set; }
    }
}
