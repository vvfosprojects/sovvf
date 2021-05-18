using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;

namespace SO115App.Models.Classi.Pos
{
    public class DtoPos
    {
        public string CodSede { get; set; }
        public List<TipologiaPos> ListaTipologie { get; set; }
        public string DescrizionePos { get; set; }
        public IFormFile FDFile { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
    }

    public class TipologiaPos
    {
        public int CodTipologia { get; set; }
        public List<int> CodDettaglioTipologia { get; set; }
    }
}
