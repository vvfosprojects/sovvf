using System.Collections.Generic;
using CQRS.Commands.Validators;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoValidator : ICommandValidator<AddInterventoCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddInterventoCommand command)
        {
            /*
            Controlli sui codici
            Se lo stato è 0 - Chiamata non devono essere presenti codici, verranno messi dal BE
            Se lo stato è 1 - Sospesa
            Se lo stato è 2 - Presidiato
            Se lo stato è 3 - Assegnata
            Se lo stato è 4 - Chiusa
            */

            // Controlli sul richiedente
            if (command.Chiamata.Richiedente.Nome.Length > 0)
            {
                if (string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Cognome))
                {
                    yield return new ValidationResult("E' presente il nome del richiedente ma non il suo cognome");
                }
            }

            if (!string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.RagioneSociale))
            {
                if (!string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Cognome) && !string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Nome))
                {
                    yield return new ValidationResult("Se è presente un nominativo per una persona fisica non può essere presente una ragione sociale");
                }
            }
        }
    }
}
