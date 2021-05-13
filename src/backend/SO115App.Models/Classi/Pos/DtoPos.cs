using Microsoft.AspNetCore.Http;
using System.IO;

namespace SO115App.Models.Classi.Pos
{
    public class DtoPos
    {
        public string CodSede { get; set; }
        public int CodTipologia { get; set; }
        public int CodTipologiaDettaglio { get; set; }
        public string DescrizionePos { get; set; }
        public IFormFile FDFile { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }

    }
}
