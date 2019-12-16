namespace SO115App.Models.Classi.Filtri
{
    /// <summary>
    ///   Classe che contiene i filtri per la ricerca delle schede contatto NUE
    /// </summary>
    public class FiltriSchede
    {
        /// <summary>
        ///   Stringa per la ricerca a testo libero
        /// </summary>
        public string TestoLibero { get; set; }

        /// <summary>
        ///   Boolana gestita
        /// </summary>
        public bool? Gestita { get; set; }

        /// <summary>
        ///   Abilita la ricerca per l'operatore che ha gestito determinate schede contatto
        /// </summary>
        public bool? CercaPerOperatore { get; set; }

        /// <summary>
        ///   Viene valorizzato con l'id dell'utente che sta filtrando le schede
        /// </summary>
        public string IdUtente { get; set; }

        /// <summary>
        ///   Identifica il range di ore entro il quale viene effettuata la ricerca delle schede contatto
        /// </summary>
        public double? RangeVisualizzazione { get; set; }
    }
}
