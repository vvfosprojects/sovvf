using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.Gac.Base;
using System;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    public class ModificaMovimentoGAC : BaseGAC
    {
        public string numeroIntervento { get; set; }
        public DateTime dataIntervento { get; set; }
        public DateTime dataUscita { get; set; }
        public DateTime dataRientro { get; set; }
        public TipoUscita tipoUscita { get; set; }
        public string autistaUscita { get; set; }
        public string autistaRientro { get; set; }
        public string longitudine { get; set; }
        public string latitudine { get; set; }
        public ComuneGAC comune { get; set; }
        public ProvinciaGAC provincia { get; set; }
        public string localita { get; set; }
    }
} 