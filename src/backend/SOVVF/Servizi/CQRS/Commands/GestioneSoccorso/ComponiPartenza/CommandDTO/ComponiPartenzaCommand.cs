using System.Collections.Generic;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO
{
    /// <summary>
    ///   DTO del command <see cref="ComponiPartenza" />
    /// </summary>
    public class ComponiPartenzaCommand
    {
        /// <summary>
        ///   E' l'id che identifica sul database la richiesta di assistenza.
        /// </summary>
        public string IdRichiestaAssistenza { get; set; }

        /// <summary>
        ///   Elenco dei mezzi che partecipano alla partenza.
        /// </summary>
        public IEnumerable<Mezzo> Mezzi { get; set; }

        /// <summary>
        ///   Elenco dei componenti che partecipano alla partenza ma privi di mezzo.
        /// </summary>
        public IEnumerable<Componente> ComponentiSenzaMezzo { get; set; }
    }
}
