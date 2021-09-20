using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Documentale
{
    public class DaoDocumentale
    {
        public string Id { get; set; }
        public string CodSede { get; set; }
        public string DescrizioneCategoria { get; set; }
        public string DescrizioneDocumento { get; set; }
        public Byte[] FDFile { get; set; }
        public string FileName { get; set; }
    }
}
