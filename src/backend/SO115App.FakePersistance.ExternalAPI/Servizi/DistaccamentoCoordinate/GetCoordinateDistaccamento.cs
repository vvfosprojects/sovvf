using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask;

namespace SO115App.ExternalAPI.Fake.Servizi.DistaccamentoCoordinate
{
    /// <summary>
    ///   classe che recupera le coordinate da un servizio fake
    /// </summary>
    public class GetCoordinateDistaccamento : IGetCoordinateDistaccamento
    {
        private readonly IGetCoordinateByCodSede _getCoordinateBycodSede;

        public GetCoordinateDistaccamento(IGetCoordinateByCodSede getCoordinateBycodSede)
        {
            _getCoordinateBycodSede = getCoordinateBycodSede;
        }

        /// <summary>
        ///   metodo che si occupa del reperimento
        /// </summary>
        /// <param name="codSede">il codice sede del distaccamento</param>
        /// <returns>Un task contenente le coordinate del distaccamento</returns>
        public Coordinate Get(string codSede)
        {
            return _getCoordinateBycodSede.Get(codSede);
        }
    }
}
