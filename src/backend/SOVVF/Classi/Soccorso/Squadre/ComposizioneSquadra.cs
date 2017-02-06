using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Squadre
{
    public class ComposizioneSquadra
    {
        public string Ticket { get; set; }

        public ISet<Componente> Componenti { get; set; }

        public DateTime? IstanteInizioValidita { get; set; }

        public DateTime? IstanteFineValidita { get; set; }
    }
}
