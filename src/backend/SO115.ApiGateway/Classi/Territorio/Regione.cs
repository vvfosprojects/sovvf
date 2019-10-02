using System.Collections.Generic;

namespace SO115App.ApiGateway.Classi
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
