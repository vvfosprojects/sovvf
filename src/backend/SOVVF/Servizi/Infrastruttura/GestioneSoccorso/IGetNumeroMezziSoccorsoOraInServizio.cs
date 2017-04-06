using System.Collections.Generic;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    ///   Servizio che restituise il numero totale dei Mezzi disponibili per il soccorso
    /// </summary>
    public interface IGetNumeroMezziSoccorsoOraInServizio
    {
        /// <summary>
        ///   Restituisce il numero totale dei Mezzi disponibili per il soccorso
        /// </summary>
        /// <param name="codice">elenco dei codici dell'Unità Operativa</param>
        /// <returns></returns>
        int Get(IEnumerable<string> codice);
    }
}
