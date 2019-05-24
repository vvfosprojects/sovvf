using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Marker
{
    public class ChiamateInCorso
    {
        public string id { get; set; }

        public string descrizioneOperatore { get; set; }

        public string codiceSedeOperatore { get; set; }

        public Localita localita { get; set; }

        public string label{ get; set; }


    }
}
