using SO115App.API.Models.Classi.Marker;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Marker
{
    public class GroupMezziMarker
    {
        public string id { get; set; }
        public List<MezzoMarker> ListaMezziMarker { get; set; }
    }
}
