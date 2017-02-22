namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi
{
    /// <summary>
    ///   DTO che alimenta la ricerca dei mezzi disponibili. I mezzi possono essere filtrati per ...
    /// </summary>
    public class DisponibilitaMezziQuery : IQuery<DisponibilitaMezziResult>
    {
        /// <summary>
        ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
        /// </summary>
        /// <remarks>
        ///   L'unità operativa indicata sarà una di quelle su cui l'operatore ha privilegi di gestione.
        /// </remarks>
        public string FiltroCodiceUnitaOperativa { get; set; }
    }
}
