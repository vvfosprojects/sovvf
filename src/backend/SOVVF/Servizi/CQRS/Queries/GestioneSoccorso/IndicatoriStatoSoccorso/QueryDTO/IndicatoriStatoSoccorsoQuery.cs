using System.Collections.Generic;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO
{
    /// <summary>
    ///   Contiene le informazioni che alimentano il calcolo degli indicatori di stato del soccorso
    /// </summary>
    public class IndicatoriStatoSoccorsoQuery : IQuery<IndicatoriStatoSoccorsoResult>
    {
        /// <summary>
        ///   E' l'insieme dei nodi dell'organigramma coinvolti nel calcolo degli indicatori
        /// </summary>
        public ISet<Nodo> NodiOrganigramma { get; set; }
    }
}
