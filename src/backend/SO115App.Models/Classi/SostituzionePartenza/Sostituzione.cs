using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.SostituzionePartenza
{
    public class Sostituzione
    {
        public string IdMezzo { get; set; }
        public List<Squadra> SquadreSmontanti { get; set; }
        public List<Squadra> SquadreMontanti { get; set; }
    }
}
