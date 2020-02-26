using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    public class ListaOperatoriQuery : IQuery<ListaOperatoriResult>
    {
        public string CodiceSede { get; set; }
        public string IdUtente { get; set; }

        public Paginazione Pagination { get; set; }

        public FiltriUtenti Filters { get; set; }
    }
}
