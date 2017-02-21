using System;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.DTO
{
    /// <summary>
    ///   Modella la selezione della squadra del DTO
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
