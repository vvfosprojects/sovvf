using System.Collections.Generic;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.QueryDTO
{
    public class SituazioneMezziQuery : IQuery<SituazioneMezziResult>
    {
        /// <summary>
        ///   E' l'insieme dei nodi dell'organigramma coinvolti nel calcolo degli indicatori
        /// </summary>
        /// <remarks>
        ///   Se UnitaOperative è un set vuoto allora il calcolo degli indicatori verrà effettuato in
        ///   base ai privilegi assegnati all'utente autenticato
        /// </remarks>
        public ISet<InfoUnitaOperativa> UnitaOperative { get; set; }
    }
}
