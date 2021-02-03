using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Triage
{
    public class Triage
    {
        public string CodiceSede { get; set; }
        public int CodTipologia { get; set; }
        public int CodDettaglioTipologia { get; set; }
        public string Text { get; set; }
        public string Value { get; set; }
        public List<Triage> InternalChildren { get; set; }
    }
}
