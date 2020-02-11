using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto
{
    public class GetSchedeContattoQueryHandler : IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult>
    {
        private readonly IGetSchedeContatto _getSchedeContatto;

        public GetSchedeContattoQueryHandler(IGetSchedeContatto getSchedeContatto)
        {
            _getSchedeContatto = getSchedeContatto;
        }

        public GetSchedeContattoResult Handle(GetSchedeContattoQuery query)
        {
            var schedeContatto = _getSchedeContatto.ListaSchedeContatto(query.CodiceSede);

            return new GetSchedeContattoResult
            {
                SchedeContatto = schedeContatto
            };
        }
    }
}
