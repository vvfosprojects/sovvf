namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    /// <summary>
    ///   oggetto della sede associata ad una persona fisica del personale in arrivo dal servizio
    ///   Utenti Comuni
    /// </summary>
    public class SedeUC
    {
        /// <summary>
        ///   l'id (codice distaccamento) della sede.
        /// </summary>
        public string id { get; set; }

        /// <summary>
        ///   la descrizione della sede
        /// </summary>
        public string descrizione { get; set; }
    }
}
