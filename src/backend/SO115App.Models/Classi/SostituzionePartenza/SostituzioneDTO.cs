using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.SostituzionePartenza
{
    public class SostituzioneDTO
    {
        public string idRichiesta { get; set; }
        public string idOperatore { get; set; }
        public DateTime DataOraOperazione { get; set; }
        public List<Sostituzione> Sostituzioni { get; set; }
    }
}
