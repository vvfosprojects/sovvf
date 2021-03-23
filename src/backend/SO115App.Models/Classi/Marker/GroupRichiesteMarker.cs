using SO115App.API.Models.Classi.Marker;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Marker
{
    public class GroupRichiesteMarker
    {
        public string id { get; set; }
        public List<MezzoMarker> ListaRichiesteMarker { get; set; }
    }
}
