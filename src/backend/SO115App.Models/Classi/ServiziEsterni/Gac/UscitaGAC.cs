using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.Gac.Base;
using System;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
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
