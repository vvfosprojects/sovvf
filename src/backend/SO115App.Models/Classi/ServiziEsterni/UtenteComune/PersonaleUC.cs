namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    /// <summary>
    ///   la classe che mappa i dati in arrivo dal servizio UtentiComuni
    /// </summary>
    public class PersonaleUC
    {
        /// <summary>
        ///   il codice fiscale della persona fisica
        /// </summary>
        public string codiceFiscale { get; set; }

        /// <summary>
        ///   il nome della persona fisica
        /// </summary>
        public string nome { get; set; }

        /// <summary>
        ///   il cognome della persona fisica
        /// </summary>
        public string cognome { get; set; }

        /// <summary>
        ///   la sede della persona fisica
        /// </summary>
        public SedeUC sede { get; set; }
    }
}
