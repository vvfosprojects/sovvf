using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class TipologiaDettaglio
    {
        public string CodSede { get; set; }
        public int CodiceTipologia { get; set; }
        public int CodiceDettaglioTipologia { get; set; }
        public string Descrizione { get; set; }
        public bool Ricorsivo { get; set; }
    }
}
