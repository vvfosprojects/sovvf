using SO115App.API.Models.Classi.Condivise;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask
{
    /// <summary>
    ///   servizio che recuoera le coordinate di un distaccamento
    /// </summary>
    public interface IGetCoordinateDistaccamento
    {
        /// <summary>
        ///   il metodo che restituisce le coordinate
        /// </summary>
        /// <param name="codSede">il codice sede del distaccamennto</param>
        /// <returns>un sistema di coordinate</returns>
        Task<Coordinate> Get(string codSede);
    }
}
