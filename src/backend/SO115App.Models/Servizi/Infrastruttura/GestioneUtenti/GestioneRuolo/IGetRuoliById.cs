using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo
{
    /// <summary>
    ///   servizio che recupera dal db una lista di ruoli a partire dall'id utente
    /// </summary>
    public interface IGetRuoliById
    {
        /// <summary>
        ///   il metodo che si occupa del reperimento dei ruoli
        /// </summary>
        /// <param name="idUtente">il codice univoco associato all'utente</param>
        /// <returns>una lista di ruoli</returns>
        IEnumerable<Role> Get(string idUtente);
    }
}
