using System.Collections.Generic;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class ErroreRichiestaSoccorsoAereo
    {
        public List<Errore> errors { get; set; }
    }

    public class Errore
    {
        public string code { get; set; }
        public string detail { get; set; }
    }
}
