using System;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi.ResultDTO
{
    /// <summary>
    ///   Modella la selezione del mezzo del DTO
    /// </summary>
    public class SelezioneMezzo
    {
        /// <summary>
        ///   Istante di selezione del mezzo.
        /// </summary>
        public DateTime IstanteSelezione { get; private set; }

        /// <summary>
        ///   Operatore che ha effettuato la selezione.
        /// </summary>
        public string Operatore { get; private set; }
    }
}
