using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltriSchede
    {
        public string TestoLibero { get; set; }
        public bool? Gestita { get; set; }
        public bool? Letta { get; set; }
        public bool? CercaPerOperatore { get; set; }
        public string IdUtente { get; set; }
        public double? RangeVisualizzazione { get; set; }
    }
}
