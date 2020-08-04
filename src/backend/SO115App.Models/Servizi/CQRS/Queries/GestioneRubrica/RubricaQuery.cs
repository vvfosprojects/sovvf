using CQRS.Queries;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQuery : IQuery<RubricaResult>
    {
        /// <summary>
        ///   Il filtro utilizzato per la ricerca delle voci in rubrica
        /// </summary>
        public string[] IdSede { get; set; }

        /// <summary>
        ///   L'id dell'operatore che ha fatto la richiesta di visualizzazione voci rubrica
        /// </summary>
        public string IdOperatore { get; set; }

        /// <summary>
        ///   l'oggetto paginazione con i parametri utili per la paginazione
        /// </summary>
        public Paginazione Pagination { get; set; }

        /// <summary>
        ///   Search è un testo libero che l'utente digita per ricercare un determinato record in
        ///   rubrica Ricerca Full-Text sul campo DESCRIZIONE della basedati
        /// </summary>
        public string Search { get; set; }
    }
}
