using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi
{
    /// <summary>
    ///   DTO che restituisce l'elenco dei mezzi disponibili.
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Reviewed.")]
    public class DisponibilitaMezziResult
    {
        /// <summary>
        ///   Contiene le informzioni relative ai mezzi disponibili.
        /// </summary>
        public IEnumerable<MezzoDisponibile> Mezzi { get; set; }
    }
}
