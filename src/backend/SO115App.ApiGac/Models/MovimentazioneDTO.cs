using System;

namespace SO115App.ApiGac.Models
{
    public class Movimentazione
    {
        public string IdRichiesta { get; set; }
        public string StatoOperativo { get; set; }
        public DateTime? DataMovimentazione { get; set; }
    }
}
