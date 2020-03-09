namespace SO115App.ExternalAPI.Fake.Classi.DistaccamentiUtenteComune
{
    /// <summary>
    ///   l'ogetto che mappa il distaccamento in arrivo dal servizio Utente Comune
    /// </summary>
    public class DistaccamentoUC
    {
        /// <summary>
        ///   l'id del distacamento composto dalla provincia e dal codice distaccamento es.: RM.1000
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///   il codice del distaccamento
        /// </summary>
        public string CodDistaccamento { get; set; }

        /// <summary>
        ///   il tipo di distaccamento
        /// </summary>
        public string Tipo { get; set; }

        /// <summary>
        ///   la provincia del distaccamento
        /// </summary>
        public string Provincia { get; set; }

        /// <summary>
        ///   l'id della sede padre
        /// </summary>
        public string IdSedePadre { get; set; }

        /// <summary>
        ///   l'indirizzo del distaccamento
        /// </summary>
        public string Indirizzo { get; set; }

        /// <summary>
        ///   il cap del distaccamento
        /// </summary>
        public string Cap { get; set; }

        /// <summary>
        ///   il comune del distaccamento
        /// </summary>
        public string Comune { get; set; }

        /// <summary>
        ///   la descrizione del distaccamento
        /// </summary>
        public string Descrizione { get; set; }
    }
}
