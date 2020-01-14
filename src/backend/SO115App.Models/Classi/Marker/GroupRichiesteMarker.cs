using SO115App.API.Models.Classi.Marker;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Marker
{
    public class GroupRichiesteMarker
    {
        public string id { get; set; }
        public List<MezzoMarker> ListaRichiesteMarker { get; set; }
    }
}
