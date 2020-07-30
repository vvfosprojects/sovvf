using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQueryHandler : IQueryHandler<RubricaQuery, RubricaResult>
    {
        private readonly IGetRubrica _getRurbica;
        private readonly IGetEnteCategorie _getCategorieEnte;
        public RubricaQueryHandler(IGetRubrica getRurbica, IGetEnteCategorie getCategorieEnte)
        {
            _getRurbica = getRurbica;
            _getCategorieEnte = getCategorieEnte;
        }

        public RubricaResult Handle(RubricaQuery query)
        {
            //TODO manca la logica per la ricorsività
            var rubrica = _getRurbica.Get(query.IdSede, true); 

            var lstCategorieEnti = _getCategorieEnte.Get(rubrica.Select(c => c.CodCategoria).ToArray());

            //var lstTelefoni = 

            return new RubricaResult() { /*Rubrica = rubrica*/ };
        }
    }
}
