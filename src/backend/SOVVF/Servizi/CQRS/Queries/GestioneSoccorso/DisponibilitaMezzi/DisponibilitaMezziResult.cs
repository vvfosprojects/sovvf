using System;
using System.Collections.Generic;
using Modello.Classi.Soccorso.Risorse;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi.DTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi
{
    /// <summary>
    ///   DTO che restituisce l'elenco dei mezzi disponibili.
    /// </summary>
    public class DisponibilitaMezziResult
    {
        /// <summary>
        ///   Contiene le informzioni relative ai mezzi disponibili.
        /// </summary>
        public IEnumerable<MezzoDisponibileDTO> Mezzi { get; set; }
    }
}
