using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    public class AnagraficaMezzo
    {
        public string Targa { get; set; }
        public string TipoMezzo { get; set; }
        public string Stato { get; set; }
        public SedeMezzo Sede { get; set; }
        public GenereMezzo GenereMezzo { get; set; }
    }

    public class GenereMezzo
    {
        public string CodiceTipo { get; set; }
        public string Codice { get; set; }
        public string Descrizione { get; set; }
    }

    public class SedeMezzo
    {
        public string Id { get; set; }
        public string CodDistaccamento { get; set; }
        public string Codice { get; set; }
        public string Descrizione { get; set; }
    }
}
