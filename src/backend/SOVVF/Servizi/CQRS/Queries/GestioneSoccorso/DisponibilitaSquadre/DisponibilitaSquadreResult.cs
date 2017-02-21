using System;
using System.Collections.Generic;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.DTO;

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
        public IEnumerable<SquadraDisponibileDTO> Squadre { get; set; }
    }
}
