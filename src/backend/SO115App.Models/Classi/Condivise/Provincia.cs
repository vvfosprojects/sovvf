using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class Provincia
    {
        public string Codice { get; set; }
        public string Nome { get; set; }
        public List<Comune> ListaComuni { get; set; }
    }
}
