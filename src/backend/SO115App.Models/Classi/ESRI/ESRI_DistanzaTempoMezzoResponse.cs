using System.Collections.Generic;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_DistanzaTempoMezzoResponse
    {
        public List<ESRI_MezzoResponse> ArrayMezzi { get; set; }
    }

    public class ESRI_MezzoResponse
    {
        public string codice { get; set; }
        public string distanza { get; set; }
        public string tempo { get; set; }
        public int rank { get; set; }
    }
}
