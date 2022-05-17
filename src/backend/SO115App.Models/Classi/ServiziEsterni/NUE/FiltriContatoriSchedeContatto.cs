using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Classi.ServiziEsterni.NUE
{
    public class FiltriContatoriSchedeContatto
    {
        public bool Gestita { get; set; } = false;

        public string RangeVisualizzazione { get; set; } = "48";

        public string Search { get; set; } = "";
    }
}
