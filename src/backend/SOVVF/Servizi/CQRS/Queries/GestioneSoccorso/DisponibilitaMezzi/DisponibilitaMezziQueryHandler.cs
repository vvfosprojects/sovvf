using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi
{
    /// <summary>
    ///   Servizio che restituisce l'elenco dei mezzi disponibili, prenotabili dall'operatore in base
    ///   alle autorizzazioni dell'operatore.
    /// </summary>
    public class DisponibilitaMezziQueryHandler : IQueryHandler<DisponibilitaMezziQuery, DisponibilitaMezziResult>
    {
        /// <summary>
        ///   Query che estrae l'elenco deli mezzi disponibili
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public DisponibilitaMezziResult Handle(DisponibilitaMezziQuery query)
        {
            // recupero della username dell'operatore che ha inviato la richiesta

            // recupero dell'elenco delle unità operative gestibili

            // esecuzione della query

            // preparazione del DTO
            var dmr = new DisponibilitaMezziResult();

            // in dmr.Mezzi andrà il risultato della query, utilizzando un mapping attraverso LINQ

            // return DTO
            return dmr;
        }
    }
}
