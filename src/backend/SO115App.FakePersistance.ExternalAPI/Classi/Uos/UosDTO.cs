using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Uos
{
    public class UosDTO
    {
        public string status { get; set; }
        public List<Elenco> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }

    public class Elenco
    {
        public string id { get; set; }
        public string codUnitaOrganizzativa { get; set; }

        public string descUnitaOrganizzativaBreve { get; set; }

        public string descUnitaOrganizzativa { get; set; }

        public string codTipologia { get; set; }

        public string codiceFiscale { get; set; }

        public string dtValInizio { get; set; }

        public string dtValFine { get; set; }

        public List<IndirizzoEmail> indirizzoMail { get; set; }

        public string rifUnitaOrganizzativaPadre { get; set; }

        public string dtIns { get; set; }
    }

    public class IndirizzoEmail
    {
        public string mail { get; set; }
        public string flPec { get; set; }
    }
}
