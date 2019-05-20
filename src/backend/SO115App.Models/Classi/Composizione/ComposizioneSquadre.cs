using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneSquadre
    {
        public Squadra Squadra { get; set; }
        public DateTime IstanteScadenzaSelezione { get; set; }
        public string idOperatore { get; set; }

    }

}
