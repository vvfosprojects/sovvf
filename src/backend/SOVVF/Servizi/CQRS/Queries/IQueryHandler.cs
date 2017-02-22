namespace Modello.Servizi.CQRS.Queries
{
    /// <summary>
    ///   Interfaccia per la gestione delle query del modello CQRS https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92
    /// </summary>
    /// <typeparam name="TResult">Oggetto risultato restituito</typeparam>
    public interface IQuery<TResult>
    {
    }

    /// <summary>
    ///   Interfaccia di gestione delle query afferente al modello CQRS https://cuttingedge.it/blogs/steven/pivot/entry.php?id=92
    /// </summary>
    /// <typeparam name="TQuery">
    ///   Oggetto per il passaggio dei parametri necessari ad eseguire la query
    /// </typeparam>
    /// <typeparam name="TResult">Oggetto valorizzato con il risultato della query</typeparam>
    public interface IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        /// <summary>
        ///   Metodo di gestione per il recupero di un oggetto TResult
        /// </summary>
        /// <param name="query">Parametro di filtraggio per il recupero informazioni.</param>
        /// <returns>DTO con valorizzazione risultati.</returns>
        TResult Handle(TQuery query);
    }
}
