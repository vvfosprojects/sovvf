using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Squadre
{
    public abstract class Squadra
    {
        public string Ticket { get; set; }

        public string Sigla { get; set; }

        public DateTime IstantePrevistoInizioServizio { get; set; }

        public DateTime IstantePrevistoFineServizio { get; set; }
    }
}
