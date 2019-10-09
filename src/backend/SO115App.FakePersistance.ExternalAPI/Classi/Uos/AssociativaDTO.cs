using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Uos
{
    internal class AssociativaDTO
    {
        public string status { get; set; }
        public List<ElencoSedi> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }

    internal class ElencoSedi
    {
        public string codUnitaOrganizzativa { get; set; }

        public string codSede { get; set; }

        public string codAssociativo { get; set; }

        public string descrizione { get; set; }

        public string dtValInizio { get; set; }

        public string dtValFine { get; set; }

        public string dtIns { get; set; }

        public string dtUltAgg { get; set; }

        public string user { get; set; }

        public string codTipoUnitaOrganizzativa { get; set; }
    }
}
