using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Servizi.Infrastruttura.Autenticazione;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneMezzo
{
    /// <summary>
    ///   Scatena la selezione di un mezzo per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa mezzo dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezionaMezzoCommandHandler : ICommandHandler<SelezionaMezzoCommand>
    {
        /// <summary>
        ///   Dipendenza che restituisce l'operatore correntemente autenticato.
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Servizio che imposta la selezione di una DisponibilitaMezzo per la risoluzione delle contese.
        /// </summary>
        private readonly ITestAndSetSelezioneDisponibilitaMezzo testAndSetSelezioneDisponibilitaMezzo;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getOperatoreAutenticato">Servizio recupero operatore autenticato.</param>
        /// <param name="testAndSetSelezioneDisponibilitaMezzo">
        ///   Servizio per la selezione del mezzo
        /// </param>
        private SelezionaMezzoCommandHandler(IGetOperatoreAutenticato getOperatoreAutenticato, ITestAndSetSelezioneDisponibilitaMezzo testAndSetSelezioneDisponibilitaMezzo)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetSelezioneDisponibilitaMezzo = testAndSetSelezioneDisponibilitaMezzo;
        }

        /// <summary>
        ///   Seleziona il mezzo.
        /// </summary>
        /// <param name="command">Command relativo al mezzo selezionato.</param>
        /// <remarks>Nel caso che la selezione non vada a buon fine, il Command solleva un'eccezione</remarks>
        public void Handle(SelezionaMezzoCommand command)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            var selezioneRisorsa = this.testAndSetSelezioneDisponibilitaMezzo.Esegui(operatore, command.CodiceMezzo);

            if (operatore != selezioneRisorsa.Operatore)
            {
                throw new InvalidOperationException("Risorsa già selezionata da " + selezioneRisorsa.Operatore);
            }
        }
    }
}
