using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Filtri
{
    public class Filtri
    {
        public List<Distaccamenti> distaccamenti { get; set; }
        public List<GeneriMezzi> generiMezzi { get; set; }

        public List<Stati> stati { get; set; }
    }
}
