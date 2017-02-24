using System;
using System.Linq;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO;

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
        ///   Metodo per l'esecuzione del command.
        /// </summary>
        /// <param name="command">Il DTO del command.</param>
        public void Handle(ComponiPartenzaCommand command)
        {
            //var richiestaAssistenza = getRichiestaAssistenzaById(command.IdRichiestaAssistenza);

            //// divido i mezzi tra quelli con capo-partenza e quelli senza
            //var mezziConCapopartenza = command.Mezzi.Where(m => m.Componenti.Any(c => c.CapoPartenza));
            //var mezziSenzaCapopartenza = command.Mezzi.Except(mezziConCapopartenza);

            throw new NotImplementedException();
        }
    }
}
