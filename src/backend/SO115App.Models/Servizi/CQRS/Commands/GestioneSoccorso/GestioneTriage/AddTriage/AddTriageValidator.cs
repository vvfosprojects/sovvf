using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage
{
    public class AddTriageValidator : ICommandValidator<AddTriageCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddTriageCommand command)
        {
            if (command.Triage == null || command.Triage == new Triage() { })
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
        }
    }
}
