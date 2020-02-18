using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class CompetenzeRichiesta
    {
        public int CodDistaccamento { get; set; }
        public string DescDistaccamento { get; set; }
        public int CodDistaccamento2 { get; set; }
        public string DescDistaccamento2 { get; set; }
        public int CodDistaccamento3 { get; set; }
        public string DescDistaccamento3 { get; set; }
        public int CodZona { get; set; }
        public string DescZona { get; set; }
        public string flag_attivo { get; set; }
        public int Ordine_Competenza { get; set; }
    }
}
