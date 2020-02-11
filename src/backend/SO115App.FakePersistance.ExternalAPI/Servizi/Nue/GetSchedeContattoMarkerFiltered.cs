using SO115App.API.Models.Classi.Geo;
using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue
{
    /// <summary>
    ///   classe che reperisce le schede marker che soddisfano i filtri in input
    /// </summary>
    public class GetSchedeContattoMarkerFiltered : IGetSchedeContattoMarkerFiltered
    {
        private readonly GetSchedeMethods _getSchedeMethods;

        public GetSchedeContattoMarkerFiltered(GetSchedeMethods getSchedeMethods)
        {
            _getSchedeMethods = getSchedeMethods;
        }

        /// <summary>
        ///   Metodo della classe che esegue la richiesta alla base dati
        /// </summary>
        /// <param name="area">l'area circoscritta con i filtri</param>
        /// <returns>una lista di schede contatto marker</returns>
        public List<SchedaContattoMarker> Get(AreaMappa area)
        {
            return _getSchedeMethods.GetMarkerFiltered(area);
        }
    }
}
