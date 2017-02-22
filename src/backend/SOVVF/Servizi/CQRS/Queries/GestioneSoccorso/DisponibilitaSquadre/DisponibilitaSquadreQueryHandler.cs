namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre
{
    /// <summary>
    ///   Servizio che restituisce l'elenco delle squadre disponibili, prenotabili dall'operatore in
    ///   base alle autorizzazioni dell'operatore.
    /// </summary>
    public class DisponibilitaSquadreQueryHandler : IQueryHandler<DisponibilitaSquadreQuery, DisponibilitaSquadreResult>
    {
        /// <summary>
        ///   Query che estrae l'elenco delle squadre disponibili
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco delle squadre disponibili</returns>
        public DisponibilitaSquadreResult Handle(DisponibilitaSquadreQuery query)
        {
            // recupero della username dell'operatore che ha inviato la richiesta

            // recupero dell'elenco delle unità operative gestibili

            // esecuzione della query

            // preparazione del DTO
            var dsr = new DisponibilitaSquadreResult();

            // in dsr.Squadre andrà il risultato della query, utilizzando un mapping attraverso LINQ

            // return DTO
            return dsr;
        }
    }
}
