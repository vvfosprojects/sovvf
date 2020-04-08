using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class Regione
    {
        public string Codice { get; set; }
        public string Nome { get; set; }
        public string codRegioneISTAT { get; set; }
        public List<Provincia> ListaProvince { get; set; }
    }
}
