using CQRS.Queries;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetModuliByCodComando
{
    public class GetModuliByCodComandoQuery : IQuery<GetModuliByCodComandoResult>
    {
        /// <summary>
        ///   Il filtro utilizzato per la ricerca dei dettagli tipologia
        /// </summary>
        public string IdSede { get; set; }

        public string NomeModulo { get; set; }

        /// <summary>
        ///   l'oggetto paginazione con i parametri utili per la paginazione
        /// </summary>
        public Paginazione Pagination { get; set; }
    }
}
