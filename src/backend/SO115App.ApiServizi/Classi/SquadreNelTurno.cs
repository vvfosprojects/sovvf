using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiServizi.Classi
{
    public class SquadreNelTurno
    {
        public string Codice { get; set; }
        public string Nome { get; set; }

        public string CodiceSede { get; set; }

        public List<SquadraDTO> ListaSquadre { get; set; }
    }
}
