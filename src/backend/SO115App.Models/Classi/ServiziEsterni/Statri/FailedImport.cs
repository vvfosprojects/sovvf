using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Statri
{
    public class Error
    {
        public int NumeroScheda { get; set; }
        public int ProgressivoScheda { get; set; }
        //public DateTime DataIntervento { get; set; }
        public string Dominio { get; set; }
        public string Failed { get; set; }
    }
}
