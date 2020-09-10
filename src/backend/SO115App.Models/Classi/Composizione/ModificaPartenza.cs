using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Classi.Composizione
{
    public class ModificaPartenza
    {
        public string CodRichiesta { get; set; }
        public bool Annullamento { get; set; }
        public string CodMezzoDaAnnullare { get; set; }
        public string[] CodSquadreDaAnnullare { get; set; }
        public Mezzo Mezzo { get; set; }
        public List<Squadra> Squadre { get; set; }
        public DateTime? DataAnnullamento { get; set; }
        public string MotivazioneAnnullamento { get; set; }
        public List<CambioStato> SequenzaStati { get; set; }
    }
}
