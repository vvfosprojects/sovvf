using SO115App.Models.Classi.Gac.Base;
using System;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    public class RientroGAC : BaseGAC
    {
        public string NumeroIntervento { get; set; }
        public DateTime DataIntervento { get; set; }
        public DateTime DataRientro { get; set; }
        public string Autista { get; set; }
    }
}
