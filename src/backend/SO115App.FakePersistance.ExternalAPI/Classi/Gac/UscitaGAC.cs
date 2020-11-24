using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    public class UscitaGAC : BaseGAC
    {
        public string NumeroIntervento { get; set; }
        public DateTime DataIntervento { get; set; }
        public DateTime DataUscita { get; set; }
        public TipoUscita TipoUscita { get; set; }
        public string Autista { get; set; }
        public string Longitudine { get; set; }
        public string Latitudine { get; set; }
        public ComuneGAC Comune { get; set; }
        public ProvinciaGAC Provincia { get; set; }
        public string Localita { get; set; }
    }
}
