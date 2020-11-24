using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    public class RientroGAC : BaseGAC
    {
        public string NumeroIntervento { get; set; }
        public DateTime DataIntervento { get; set; }
        public DateTime DataRientro { get; set; }
        public string Autista { get; set; }
    }
}
