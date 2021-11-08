using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Documentale
{
    public class DtoDocumentale
    {
        public string Id { get; set; }
        public string CodSede { get; set; }

        public string DescrizioneCategoria { get; set; }

        public string DescrizioneDocumento { get; set; }
        public string FileName { get; set; }
        public IFormFile FDFile { get; set; }
    }
}
