using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza
{
    /// <summary>
    ///   Per una specifica richiesta di assistenza dispone l'invio di risorse (uomini e mezzi). Il
    ///   command crea tante istanze di evento <see cref="ComposizionePartenza" /> quanti sono i
    ///   capo-partenza presenti nei componenti.
    /// </summary>
    public class ComponiPartenzaCommandHandler : ICommandHandler<ComponiPartenzaCommand>
    {
        /// <summary>
        ///   Metodo per l'esecuzione del command.
        /// </summary>
        /// <param name="command">Il DTO del command.</param>
        public void Handle(ComponiPartenzaCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
