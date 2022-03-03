using System.Collections.Generic;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_DistanzaTempoMezzi
    {
        public string coordinateIntervento { get; set; }
        public List<ESRI_Mezzo> mezzi { get; set; }
    }

    public class ESRI_Mezzo
    {
        public string codice { get; set; }
        public string coordinate { get; set; }
        public bool track { get; set; }
    }
}
