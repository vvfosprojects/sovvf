using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.PersonaleUtentiComuni
{
    /// <summary>
    ///   la classe che mappa i dati in arrivo dal servizio UtentiComuni
    /// </summary>
    public class PersonaleUC
    {
        /// <summary>
        ///   il codice fiscale della persona fisica
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   il nome della persona fisica
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   il cognome della persona fisica
        /// </summary>
        public string Cognome { get; set; }

        /// <summary>
        ///   la sede della persona fisica
        /// </summary>
        public SedeUC Sede { get; set; }
    }
}
