using System;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    /// <summary>
    ///   servizio che si occupa dell'invio di una richiesta ad un api esterna in modo da settare un
    ///   mezzo in stato libero
    /// </summary>
    public interface ISetMezzoOccupato
    {
        /// <summary>
        ///   il metodo che in base ai paramentri in input si occupa di mandare la richiesta al web service
        /// </summary>
        /// <param name="codMezzo">il codice del mezzo in movimentazione</param>
        /// <param name="dataMov">la data di inizio movimentazione</param>
        /// <param name="idRichiesta">i'id della richiesta a cui è associato il mezzo</param>
        /// <param name="codTipologia">il cod della tipologia dell'intervento</param>
        /// <param name="descTipologia">la descrizione della tipologia dell'intervento</param>
        Task Set(string codMezzo, DateTime dataMov, string idRichiesta, string codTipologia, string descTipologia);
    }
}
