using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Marker
{
    public class GroupSchedeNueMarker
    {
        public string id { get; set; }
        public List<SchedaContattoMarker> ListaSchedeNueMarker { get; set; }
    }
}
