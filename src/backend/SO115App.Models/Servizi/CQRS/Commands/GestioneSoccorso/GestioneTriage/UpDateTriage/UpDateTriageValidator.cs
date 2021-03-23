using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage
{
    public class UpDateTriageValidator : ICommandValidator<UpDateTriageCommand>
    {
        public IEnumerable<ValidationResult> Validate(UpDateTriageCommand command)
        {
            if (command.Triage == null || command.Triage == new Triage() { })
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
        }
    }
}
