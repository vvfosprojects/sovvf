using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Pos
{
    public class PosDAO
    {
        public string Id { get; set; }
        public string CodSede { get; set; }
        public List<TipologiaPos> ListaTipologie { get; set; }
        public string DescrizionePos { get; set; }

        public Byte[] FDFile { get; set; }
    }
}
