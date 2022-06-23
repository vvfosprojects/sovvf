using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedaContattoById
{
    public class GetSchedaContattoByIdQuery : IQuery<GetSchedaContattoByIdResult>
    {
        public string Codice { get; set; }
        public string CodiceSede { get; set; }
    }
}
