using System.Collections.Generic;
using Modello.Classi.Soccorso.Eventi.Partenze;

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
        ///   E' l'attributo che identifica la collezione di <see cref="ComposizionePartenza" /> già
        ///   definita nelle classi del dominio
        /// </summary>
        public IEnumerable<ComposizionePartenza> ComposizioniPartenza { get; set; }
    }
}
