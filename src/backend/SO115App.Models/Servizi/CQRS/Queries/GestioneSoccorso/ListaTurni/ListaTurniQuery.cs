using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.ListaTurni
{
    internal class ListaTurniQuery : IQuery<ListaTurniResult>
    {
        public string CodiceSede { get; set; }
    }
}
