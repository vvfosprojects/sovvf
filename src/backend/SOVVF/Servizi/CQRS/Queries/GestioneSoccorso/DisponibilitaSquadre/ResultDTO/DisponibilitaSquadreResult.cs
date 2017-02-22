using System.Collections.Generic;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre
{
    /// <summary>
    ///   DTO che restituisce l'elenco delle squadre disponibili.
    /// </summary>
    public class DisponibilitaSquadreResult
    {
        /// <summary>
        ///   Contiene le informazioni relativamente alle squadre disponibili.
        /// </summary>
        public IEnumerable<SquadraDisponibile> Squadre { get; set; }
    }
}
