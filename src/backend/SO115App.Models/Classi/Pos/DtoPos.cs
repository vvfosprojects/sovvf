using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;

namespace SO115App.Models.Classi.Pos
{
    public class DtoPos
    {
        public string Id { get; set; }
        public string CodSede { get; set; }

        public string ListaTipologie { get; set; }

        public List<TipologiaPos> ListaTipologieConvert { get; set; }
        public string DescrizionePos { get; set; }

        public IFormFile FDFile { get; set; }

        public string FileName { get; set; }
    }

    public class TipologiaPos
    {
        public int CodTipologia { get; set; }
        public List<int> CodTipologiaDettaglio { get; set; }
    }
}
