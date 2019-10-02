using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiTerritorio.Classi
{
    public class Comune
    {
        public int codComune { get; set; }
        public string codProvincia { get; set; }
        public string descComune { get; set; }
        public string siglaNazionale { get; set; }
        public string siglaCatastale { get; set; }
        public string cap { get; set; }
        public string festaPatronale { get; set; }
        public string flVariazione { get; set; }
    }
}
