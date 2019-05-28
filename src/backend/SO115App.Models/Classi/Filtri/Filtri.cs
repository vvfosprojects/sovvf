using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Filtri
{
    public class Filtri
    {
        public List<Distaccamenti> Distaccamenti { get; set; }
        public List<GeneriMezzi> GeneriMezzi { get; set; }

        public List<Stati> Stati { get; set; }
    }
}
