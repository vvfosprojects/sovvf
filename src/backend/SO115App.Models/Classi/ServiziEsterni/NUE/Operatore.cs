using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.NUE
{
    /// <summary>
    ///   descrive l'operatore che gestisce la scheda contatto in uscita dal NUE
    /// </summary>
    public class Operatore
    {
        /// <summary>
        ///   indica il codice della postazione da cui opera l'operatore
        /// </summary>
        public string CodicePostazioneOperatore { get; set; }

        /// <summary>
        ///   identifica il CF dell'operatore
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   descrive il codice della sede dove l'operatore svolge le sue funzioni
        /// </summary>
        public string CodiceSede { get; set; }
    }
}
