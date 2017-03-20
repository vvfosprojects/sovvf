using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RestInterface.Models
{
    public class InfoUtenteAutenticato
    {
        public string Nominativo { get; set; }
        public string Username { get; set; }
        public DateTime IstanteAutenticazione { get; set; }
    }
}
