namespace SO115App.WSNue.Classi.NUE
{
    /// <summary>
    ///   descrive l'operatore che gestisce la scheda contatto in uscita dal NUE
    /// </summary>
    public class Operatore
    {
        /// <summary>
        ///   indica il codice della postazione da cui opera l'operatore
        /// </summary>
        public string codicePostazioneOperatore { get; set; }

        /// <summary>
        ///   identifica il CF dell'operatore
        /// </summary>
        public string codiceFiscale { get; set; }

        /// <summary>
        ///   descrive il codice della sede dove l'operatore svolge le sue funzioni
        /// </summary>
        public string codiceSede { get; set; }
    }
}
