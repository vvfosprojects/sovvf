using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class Distaccamento
    {
        public int CodDistaccamento { get; set; }
        public string DescDistaccamento { get; set; }
        public string CodSede { get; set; }
        public string Indirizzo { get; set; }
        public string Cap { get; set; }
        public Coordinate Coordinate { get; set; }
    }
}
