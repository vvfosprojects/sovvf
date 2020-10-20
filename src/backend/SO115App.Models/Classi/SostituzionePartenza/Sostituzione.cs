using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.SostituzionePartenza
{
    public class Sostituzione
    {
        public string CodMezzoSmontante { get; set; }
        public string[] SquadreSmontanti { get; set; }
        public string CodMezzoMontante { get; set; }
        public string[] SquadreMontanti { get; set; }
    }
}
