using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class ObiettivoSensibile
    {
        private string Nome { get; set; }
        private string[] Documenti { get; set; }
        private Coordinate Coordinate { get; set; }
        private string Indirizzo { get; set; }
    }
}
