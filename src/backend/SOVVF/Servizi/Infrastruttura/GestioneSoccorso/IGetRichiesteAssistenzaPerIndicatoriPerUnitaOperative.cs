using System.Collections.Generic;
using Modello.Classi.Organigramma;
using Modello.Classi.Soccorso;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    ///   Servizio che restituisce l'elenco delle richieste di Assistenza utilizzate per il calcolo
    ///   degli indicatori per le Unità Operative indicate
    /// </summary>
    public interface IGetRichiesteAssistenzaPerIndicatoriPerUnitaOperative
    {
        /// <summary>
        ///   Restituisce l'elenco delle Richieste di Assistenza
        /// </summary>
        /// <param name="codice">elenco dei codici dell'Unità Operativa</param>
        /// <returns></returns>
        IEnumerable<RichiestaAssistenza> Get(IEnumerable<string> codice);
    }
}
