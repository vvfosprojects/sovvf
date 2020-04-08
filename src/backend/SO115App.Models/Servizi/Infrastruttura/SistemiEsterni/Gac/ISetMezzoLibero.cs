using System;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    /// <summary>
    ///   servizio che si occupa dell'invio di una richiesta ad un api esterna in modo da settare un
    ///   mezzo in stato libero
    /// </summary>
    public interface ISetMezzoLibero
    {
        /// <summary>
        ///   il metodo che invia la request per il settaggio del mezzo in stato libero
        /// </summary>
        /// <param name="codMezzo">il codice del mezzo</param>
        /// <param name="dataMov">la data di movimentazione</param>
        /// <param name="idRichiesta">l'id della richiesta a cui è associtao il mezzo</param>
        Task Set(string codMezzo, DateTime dataMov, string idRichiesta);
    }
}
