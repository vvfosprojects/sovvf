using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltriListaMezziInServizio
    {
        public string Search { get; set; }
        public string[] StatiMezzo { get; set; }
        private string[] CodiciSede { get; set; }
    }
}
