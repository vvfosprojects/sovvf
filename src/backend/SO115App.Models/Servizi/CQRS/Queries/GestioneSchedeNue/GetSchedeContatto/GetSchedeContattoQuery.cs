using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto
{
    public class GetSchedeContattoQuery : IQuery<GetSchedeContattoResult>
    {
        public string CodiceSede { get; set; }
    }
}
