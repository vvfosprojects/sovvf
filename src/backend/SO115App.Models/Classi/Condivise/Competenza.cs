using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class Competenza
    {
        public int CodDistaccamento { get; set; }
        public int CodZona { get; set; }
        public string DescZona { get; set; }
        public string flag_attivo { get; set; }
        public int Ordine_Competenza { get; set; }
    }
}
