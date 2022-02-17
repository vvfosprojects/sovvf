using System.Collections.Generic;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_DistanzaTempoMezzi
    {
        public string CoordinateIntervento { get; set; }
        public List<ESRI_Mezzo> Mezzi { get; set; }
    }

    public class ESRI_Mezzo
    {
        public string CodiceMezzo { get; set; }
        public string Coordinate { get; set; }
        public bool Track { get; set; }
    }
}
