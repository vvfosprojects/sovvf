namespace SO115App.Models.Classi.Utenti.Autenticazione
{
    /// <summary>
    ///   classe che mappa il personale in arrivo da oracle o dai servizi esterni
    /// </summary>
    public class PersonaleVVF
    {
        /// <summary>
        ///   nominativo composto da nome.cognome
        /// </summary>
        public string Nominativo { get; set; }

        /// <summary>
        ///   codice fiscale
        /// </summary>
        public string CodiceFiscale { get; set; }
    }
}
