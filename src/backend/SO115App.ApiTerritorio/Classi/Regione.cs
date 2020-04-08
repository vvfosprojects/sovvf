using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiTerritorio.Classi
{
    public class Regione
    {
        public string codRegioneISTAT { get; set; }
        public string descRegione { get; set; }
        public string codArea { get; set; }
        public string codRegioneAT { get; set; }
        public List<Provincia> ListaProvince { get; set; }
    }
}
