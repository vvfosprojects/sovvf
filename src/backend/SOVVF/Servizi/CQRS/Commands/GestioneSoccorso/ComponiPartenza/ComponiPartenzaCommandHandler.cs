using Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza
{
    /// <summary>
    ///   Per una specifica richiesta di assistenza dispone l'invio di risorse (uomini e mezzi). Il
    ///   command crea tante istanze di evento <see cref="ComposizionePartenza" /> quanti sono i
    ///   capo-partenza presenti nei componenti. Rilascia tutte le risorse selezionate.
    /// </summary>
    public class ComponiPartenzaCommandHandler : ICommandHandler<ComponiPartenzaCommand>
    {
        /// <summary>
        ///   Servizio che eroga il contenuto di una Richiesta di Assistenza
        /// </summary>
        private readonly IGetRichiestaAssistenzaById getRichiestaAssistenzaById;

        /// <summary>
        ///   Servizio che salva una Richiesta di Assistenza
        /// </summary>
        private readonly ISaveRichiestaAssistenza saveRichiestaAssistenza;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getRichiestaAssistenzaById">Istanza del servizio <see cref="getRichiestaAssistenzaById" />.</param>
        /// <param name="saveRichiestaAssistenza">Istanza del servizio <see cref="saveRichiestaAssistenza" /></param>
        public ComponiPartenzaCommandHandler(
            IGetRichiestaAssistenzaById getRichiestaAssistenzaById,
            ISaveRichiestaAssistenza saveRichiestaAssistenza)
        {
            this.getRichiestaAssistenzaById = getRichiestaAssistenzaById;
            this.saveRichiestaAssistenza = saveRichiestaAssistenza;
        }

        /// <summary>
        ///   Metodo per l'esecuzione del command.
        /// </summary>
        /// <param name="command">Il DTO del command.</param>
        public void Handle(ComponiPartenzaCommand command)
        {
            var richiestaAssistenza = this.getRichiestaAssistenzaById.Get(command.IdRichiestaAssistenza);

            foreach (var cp in command.ComposizioniPartenza)
            {
                richiestaAssistenza.Eventi.Add(cp);
            }

            this.saveRichiestaAssistenza.Save(richiestaAssistenza);
        }
    }
}
