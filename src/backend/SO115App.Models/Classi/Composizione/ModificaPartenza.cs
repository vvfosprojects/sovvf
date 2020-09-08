using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Composizione
{
    public class ModificaPartenza
    {
        public bool Annullamento { get; set; }
        public string CodMezzoDaAnnullare { get; set; }
        public string[] CodSquadreDaAnnullare { get; set; }
        public string CodMezzo { get; set; }
        public string[] CodSquadre { get; set; }
        public string CodRichiesta { get; set; }
        public DateTime? DataAnnullamento { get; set; }
        public string MotivazioneAnnullamento { get; set; }
        public List<CambioStato> SequenzaStati { get; set; }
    }
}
