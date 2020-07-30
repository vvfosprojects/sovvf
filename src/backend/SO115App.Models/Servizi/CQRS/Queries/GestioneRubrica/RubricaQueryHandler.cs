using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.Rubrica;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQueryHandler : IQueryHandler<RubricaQuery, RubricaResult>
    {
        private readonly IGetRubrica _getRurbica;
        public RubricaQueryHandler(IGetRubrica getRurbica)
        {
            _getRurbica = getRurbica;
        }

        public RubricaResult Handle(RubricaQuery query)
        {
            var rubrica = _getRurbica.Get();

            //rubrica.ForEach(ente => ente.);

            return new RubricaResult() { Rubrica = rubrica };
        }
    }
}
