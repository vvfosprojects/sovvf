using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.Gac.Base;
using System;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    public class UscitaGAC : BaseGAC
    {
        public string numeroIntervento { get; set; }
        public DateTime dataIntervento { get; set; }
        public DateTime dataUscita { get; set; }
        /// <summary>
        /// Tipologia Richiesta
        /// </summary>
        public TipoUscita tipoUscita { get; set; }
        public string autista { get; set; }
        public string longitudine { get; set; }
        public string latitudine { get; set; }
        public ComuneGAC comune { get; set; }
        public ProvinciaGAC provincia { get; set; }
        public string localita { get; set; }
    }
}
