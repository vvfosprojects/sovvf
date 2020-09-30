using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Fonogramma
{
    public class Fonogramma
    {
        public string IdOperatore { get; set; }
        public string IdRichiesta { get; set; }
        public string NumeroFonogramma { get; set; }

        public string ProtocolloFonogramma { get; set; }

        public string Destinatari { get; set; }

        public StatoFonogramma Stato { get; set; }
    }

    public enum StatoFonogramma
    {
        NonNecessario,
        DaInviare,
        Inviato
    }
}
