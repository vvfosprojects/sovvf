namespace Modello.Classi.Soccorso.Eventi.Segnalazioni
{
    /// <summary>
    ///   Modella una chiamata telefonica proveniente ad una linea della sala operativa.
    /// </summary>
#warning Non è chiaro se Telefonata debba diventare una classe astratta e avere come derivate TelefonataEsterna, TelefonataNUE, ecc.

    public class Telefonata : Segnalazione
    {
        /// <summary>
        ///   Il codice origine è mappato sul numero di telefono per una telefonata
        /// </summary>
        public override string CodiceOrigine
        {
            get
            {
                return NumeroTelefono;
            }
        }

        /// <summary>
        ///   E' il cognome del chiamante.
        /// </summary>
        public string CognomeChiamante { get; set; }

        /// <summary>
        ///   E' il nome del chiamante
        /// </summary>
        public string NomeChiamante { get; set; }

        /// <summary>
        ///   E' il numero di telefono del chiamante
        /// </summary>
        public string NumeroTelefono { get; set; }

        /// <summary>
        ///   E' la ragione sociale del chiamante. Ad es.: Carabinieri, CC, Polizia Municipale, 118, ecc.
        /// </summary>
        public string RagioneSociale { get; set; }

        /// <summary>
        ///   E' il codice della scheda contatto legata alla telefonata. In linea di principio, una
        ///   scheda contatto potrebbe non avere seguito e non generare un'istanza di telefonata,
        ///   anche se questa possibilità indica una potenziale anomalia di processo.
        /// </summary>
        public string CodiceSchedaContatto { get; set; }
    }
}
