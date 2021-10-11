using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_RichiestaMessage
    {
        // MongDb_Id, codice, stato, descrizione, categoria
        public string mongodb_id { get; set; }

        public string codice { get; set; }
        public string stato { get; set; }
        public string descrizione { get; set; }
        public string categoria { get; set; }
    }
}
