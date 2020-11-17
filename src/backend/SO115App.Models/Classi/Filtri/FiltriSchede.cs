using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.Filtri
{
    /// <summary>
    ///   Classe che contiene i filtri per la ricerca delle schede contatto NUE
    /// </summary>
    public class FiltriSchede
    {
        ///// <summary>
        /////   Stringa per la ricerca a testo libero
        ///// </summary>
        //public string TestoLibero { get; set; }

        ///// <summary>
        /////   Abilita la ricerca per l'operatore che ha gestito determinate schede contatto
        ///// </summary>
        //public bool? CercaPerOperatore { get; set; }

        ///// <summary>
        /////   Viene valorizzato con l'id dell'utente che sta filtrando le schede
        ///// </summary>
        //public string IdUtente { get; set; }

        /// <summary>
        ///   Boolana gestita
        /// </summary>
        public bool? Gestita { get; set; }

        /// <summary>
        ///   Identifica il range di ore entro il quale viene effettuata la ricerca delle schede contatto
        /// </summary>
        public int? RangeVisualizzazione { get; set; }

        ///<summary>
        ///   Stringa per la ricerca a testo libero
        /// </summary>
        public string Search { get; set; }

        ///<summary>
        ///   Stringa utilizzata per i suggerimenti di raggruppamento per Nominativo
        /// </summary>
        public string Nominativo { get; set; }

        ///<summary>
        ///   Stringa utilizzata per i suggerimenti di raggruppamento per Indirizzo
        /// </summary>
        public string Indirizzo { get; set; }

        ///<summary>
        ///   Stringa utilizzata per i suggerimenti di raggruppamento per Telefono
        /// </summary>
        public string Telefono { get; set; }

        ///<summary>
        ///   Stringa utilizzata per i suggerimenti di raggruppamento per Coordinate
        /// </summary>
        public Coordinate Coordinate { get; set; }
    }
}
