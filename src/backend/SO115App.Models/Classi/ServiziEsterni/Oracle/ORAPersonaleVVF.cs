namespace SO115App.Models.Classi.ServiziEsterni.Oracle
{
    /// <summary>
    ///   DTO in arrivo dalla tabella Personale di Oracle
    /// </summary>
    public class ORAPersonaleVVF
    {
        /// <summary>
        ///   Codice fiscale della persona
        /// </summary>
        public string CodFiscale { get; set; }

        /// <summary>
        ///   npominativo nome.cognome della persona
        /// </summary>
        public string Nominativo { get; set; }

        /// <summary>
        ///   il codice della sede della persona
        /// </summary>
        public string Sede { get; set; }
    }
}
