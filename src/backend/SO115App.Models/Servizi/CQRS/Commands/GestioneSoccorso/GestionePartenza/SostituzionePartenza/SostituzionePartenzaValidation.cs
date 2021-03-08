using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaValidation : ICommandValidator<SostituzionePartenzaCommand>
    {
        private IGetRichiesta _getRichiesta;

        public SostituzionePartenzaValidation(IGetRichiesta getRichiesta) => _getRichiesta = getRichiesta;

        public IEnumerable<ValidationResult> Validate(SostituzionePartenzaCommand command)
        {
            //CONTROLLI RICHIESTA
            command.Richiesta = _getRichiesta.GetById(command.sostituzione.idRichiesta);

            if (command.Richiesta == null)
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            else if (command.sostituzione.Sostituzioni == null || command.sostituzione.Sostituzioni.Count == 0)
                yield return new ValidationResult("La richiesta non ha partenze da sostituire");

            if (command.Richiesta.Sospesa)
                yield return new ValidationResult("Non puoi modificare una richiesta sospesa");

            if (command.Richiesta.Chiusa)
                yield return new ValidationResult("Non puoi modificare una richiesta chiusa");

            if (command.sostituzione.idRichiesta == null || command.sostituzione.idRichiesta == "")
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);

            if (command.sostituzione.DataOraOperazione == null || command.sostituzione.DataOraOperazione == default)
                yield return new ValidationResult("Nessuna data sostituzione selezionata");
        }
    }
}
