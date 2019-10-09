using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Uos
{
    public class SedeDTO
    {
        public string status { get; set; }
        public List<ElencoSediDTO> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }

    public class ElencoSediDTO
    {
        public string id { get; set; }
        public string codSede { get; set; }

        public IndirizzoSede indirizzoSede { get; set; }

        public List<Recapito> recapito { get; set; }

        public List<Mail> mail { get; set; }

        public string coordinateGeo { get; set; }

        public string dtValInizio { get; set; }
        public string dtValFine { get; set; }
    }

    public class IndirizzoSede
    {
        public string indirizzo { get; set; }

        public string cap { get; set; }

        public int codRegione { get; set; }

        public string codProvincia { get; set; }

        public string codComune { get; set; }
    }

    public class Recapito
    {
        public string tipo { get; set; }
        public string numero { get; set; }
    }

    public class Mail
    {
        public string mail { get; set; }
        public string flUfficiale { get; set; }
    }
}
