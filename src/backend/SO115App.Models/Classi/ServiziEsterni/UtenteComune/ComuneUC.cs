using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    public class ComuneUC
    {
        public string codice { get; set; }
        public string descrizione { get; set; }

        public ProvinciaUC provincia { get; set; }
    }

    public class ProvinciaUC
    {
        public string codice { get; set; }
        public string descrizione { get; set; }

        public RegioneUC regione { get; set; }
    }

    public class RegioneUC
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
    }

  //  {
  //  "provincia": {
  //    "regione": {
  //      "area": "CENTRO",
  //      "codice": "12",
  //      "descrizione": "LAZIO"
  //    },
  //    "codice": "LT",
  //    "descrizione": "LATINA"
  //  },
  //  "siglaNazionale": "D662",
  //  "cap": "04022",
  //  "codice": "59007",
  //  "descrizione": "FONDI"
  //}
}
