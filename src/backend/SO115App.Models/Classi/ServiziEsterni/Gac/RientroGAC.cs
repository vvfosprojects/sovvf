﻿using SO115App.Models.Classi.Gac.Base;
using System;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    public class RientroGAC : BaseGAC
    {
        public string numeroIntervento { get; set; }
        public DateTime dataIntervento { get; set; }
        public DateTime dataRientro { get; set; }
        public string autista { get; set; }
    }


    public class RientroGacResponse
    {
        public string codiceEsito { get; set; }
        public string descrizioneEsito { get; set; }
        public bool errore { get; set; }
    }
}
