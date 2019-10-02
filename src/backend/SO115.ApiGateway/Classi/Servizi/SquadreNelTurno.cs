using System.Collections.Generic;

namespace SO115App.ApiGateway.Classi
{
    public class SquadreNelTurno
    {
        public string Codice { get; set; }
        public string Nome { get; set; }

        public string CodiceSede { get; set; }

        public List<Squadra> ListaSquadre { get; set; }
    }
}
