using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SO115App.Models.Classi.Composizione
{
    public class ModificaPartenza
    {
        //[Required]
        public bool Annullamento { get; set; }
        //[Required]
        public string CodMezzo { get; set; }
        //[Required]
        public string[] CodSquadre { get; set; }
        //[Required]
        public string CodRichiesta { get; set; }
        public DateTime? DataAnnullamento { get; set; }
        public string MotivazioneAnnullamento { get; set; }
        public List<CambioStato> SequenzaStati { get; set; }
    }
}
