using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

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
            //MAPPING
            return new RubricaResult()
            {
                Rubrica = _getRurbica.Get(query.IdSede)
            };
        }
    }
}
