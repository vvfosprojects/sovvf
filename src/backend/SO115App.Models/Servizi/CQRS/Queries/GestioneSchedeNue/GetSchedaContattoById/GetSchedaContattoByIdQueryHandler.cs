using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedaContattoById
{
    public class GetSchedaContattoByIdQueryHandler : IQueryHandler<GetSchedaContattoByIdQuery, GetSchedaContattoByIdResult>
    {
        private readonly IGetSchedaContattoByCodice _getSchedaContatto;

        public GetSchedaContattoByIdQueryHandler(IGetSchedaContattoByCodice getSchedaContatto)
        {
            _getSchedaContatto = getSchedaContatto;
        }

        public GetSchedaContattoByIdResult Handle(GetSchedaContattoByIdQuery query)
        {
            return new GetSchedaContattoByIdResult
            {
                SchedaContatto = _getSchedaContatto.Get(query.Codice)
            };
        }
    }
}
