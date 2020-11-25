using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    public class LogException
    {
        public DateTime DataOraEsecuzione { get; set; }
        public string Servizio { get; set; }
        public string Content { get; set; }
        public string Response { get; set; }
        public string CodComando { get; set; }
        public string IdOperatore { get; set; }
    }
}
