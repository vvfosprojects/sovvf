using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

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
            //var lstEnti = _getRurbica.Get(query.IdSede, true); 

            //var lstCategorieEnti = _getCategorieEnte.Get(lstEnti.Select(c => c.CodCategoria).ToArray());

            //var lstTelefoni = _getEnteTelefoni.Get(lstEnti.Select(c => c.Codice.ToString()).ToArray());

            return new RubricaResult() { };
        }
    }
}
