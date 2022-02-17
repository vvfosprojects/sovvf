using System.Collections.Generic;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_DistanzaTempoMezzoResponse
    {
        public List<ESRI_MezzoResponse> ArrayMezzi { get; set; }
    }

    public class ESRI_MezzoResponse
    {
        public string Codice { get; set; }
        public string Km { get; set; }
        public string Minuti { get; set; }
        //public bool Track { get; set; }
        //public int rank { get; set; }
    }
}
