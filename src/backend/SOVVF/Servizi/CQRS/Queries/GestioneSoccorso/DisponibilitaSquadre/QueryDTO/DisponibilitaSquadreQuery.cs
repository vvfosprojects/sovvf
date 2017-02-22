namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre
{
    /// <summary>
    ///   DTO che alimenta la ricerca delle squadre disponibili. Le squadre possono essere filtrate
    ///   per unità operativa.
    /// </summary>
    public class DisponibilitaSquadreQuery : IQuery<DisponibilitaSquadreResult>
    {
        /// <summary>
        ///   Filtra solo le squadre appartenenti all'unità operativa indicata.
        /// </summary>
        /// <remarks>
        ///   L'unità operativa indicata sarà una di quelle su cui l'operatore ha privilegi di gestione.
        /// </remarks>
        public string FiltroCodiceUnitaOperativa { get; set; }
    }
}
