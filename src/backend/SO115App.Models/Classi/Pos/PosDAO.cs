using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Pos
{
    public class PosDAO
    {
        public string CodSede { get; set; }
        public List<TipologiaPos> ListaTipologie { get; set; }
        public string DescrizionePos { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
    }
}
