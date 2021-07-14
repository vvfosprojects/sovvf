using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneFile.ChiamateInSospeso
{
    public class ChiamateInSospesoQuery : IQuery<ChiamateInSospesoResult>
    {
        /// <summary>
        ///   Il filtro utilizzato per la ricerca delle voci in rubrica
        /// </summary>
        public string[] IdSede { get; set; }

        /// <summary>
        ///   L'id dell'operatore che ha fatto la richiesta di visualizzazione voci rubrica
        /// </summary>
        public string IdOperatore { get; set; }
    }
}
