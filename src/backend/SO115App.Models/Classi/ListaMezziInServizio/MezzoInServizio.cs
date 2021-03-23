using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using System.Collections.Generic;

namespace SO115App.Models.Classi.ListaMezziInServizio
{
    public class MezzoInServizio
    {
        public MezzoMarker Mezzo { get; set; }
        public List<Squadra> Squadre { get; set; }
    }
}
