using System.Collections.Generic;

namespace SO115App.Models.Classi.ServiziEsterni.AFM
{
    public class ErroreRichiestaSoccorsoAereo
    {
        public List<Errore> errors { get; set; }

        public bool IsError() => errors != null && errors.Count > 0;
    }

    public class Errore
    {
        public string code { get; set; }
        public string detail { get; set; }
    }
}
