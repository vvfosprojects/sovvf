using System;

namespace RestInterface.Models
{
    public class InfoUtenteAutenticato
    {
        public string Nominativo { get; set; }
        public string Username { get; set; }
        public DateTime IstanteAutenticazione { get; set; }
    }
}
