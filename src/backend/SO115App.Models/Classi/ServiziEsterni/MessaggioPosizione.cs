using System;

namespace SO115App.Models.Classi.ServiziEsterni
{
    public class MessaggioPosizione
    {
        public string CodiceMezzo { get; set; }
        public Localizzazione Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }
    }
}
