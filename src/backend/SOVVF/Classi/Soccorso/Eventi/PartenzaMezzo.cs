using System.Collections.Generic;

namespace Modello.Classi.Soccorso.Eventi
{
    public class PartenzaMezzo
    {
        /// <summary>
        ///   E' il codice che identifica univocamente il mezzo
        /// </summary>
        public string CodiceMezzo { get; set; }

        public string CodiceFiscaleAutista { get; set; }

        public IList<string> Passeggeri { get; set; }
    }
}
