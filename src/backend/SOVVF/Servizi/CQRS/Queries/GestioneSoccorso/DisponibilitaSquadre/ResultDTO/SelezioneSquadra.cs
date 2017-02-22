using System;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.ResultDTO
{
    /// <summary>
    ///   Modella la selezione della squadra
    /// </summary>
    public class SelezioneSquadra
    {
        /// <summary>
        ///   Istante di selezione della squadra.
        /// </summary>
        public DateTime IstanteSelezione { get; private set; }

        /// <summary>
        ///   Operatore che ha effettuato la selezione.
        /// </summary>
        public string Operatore { get; private set; }
    }
}
