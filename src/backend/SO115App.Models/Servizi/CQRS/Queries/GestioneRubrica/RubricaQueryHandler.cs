using CQRS.Queries;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQueryHandler : IQueryHandler<RubricaQuery, RubricaResult>
    {
        private readonly IGetRubrica _getRurbica;
        private readonly IGetEnteCategorie _getCategorieEnte;
        private readonly IGetEnteTelefoni _getEnteTelefoni;
        public RubricaQueryHandler(IGetRubrica getRurbica, IGetEnteCategorie getCategorieEnte, IGetEnteTelefoni getEnteTelefoni)
        {
            _getRurbica = getRurbica;
            _getCategorieEnte = getCategorieEnte;
            _getEnteTelefoni = getEnteTelefoni;
        }

        public RubricaResult Handle(RubricaQuery query)
        {
            //TODO manca la logica per la ricorsività
            //var lstEnti = _getRurbica.Get(query.IdSede, true); 

            //var lstCategorieEnti = _getCategorieEnte.Get(lstEnti.Select(c => c.CodCategoria).ToArray());

            //var lstTelefoni = _getEnteTelefoni.Get(lstEnti.Select(c => c.Codice.ToString()).ToArray());

            return new RubricaResult() {  };
        }
    }
}
