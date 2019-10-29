using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
{
    public class Movimentazione
    {
        public string IdRichiesta { get; set; }
        public string StatoOperativo { get; set; }
        public DateTime? DataMovimentazione { get; set; }
    }
}
