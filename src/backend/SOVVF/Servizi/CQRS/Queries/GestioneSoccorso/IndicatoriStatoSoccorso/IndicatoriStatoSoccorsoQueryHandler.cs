using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso
{
    public class IndicatoriStatoSoccorsoQueryHandler : IQueryHandler<IndicatoriStatoSoccorsoQuery, IndicatoriStatoSoccorsoResult>
    {
        public IndicatoriStatoSoccorsoResult Handle(IndicatoriStatoSoccorsoQuery query)
        {
            throw new NotImplementedException();
        }
    }
}
