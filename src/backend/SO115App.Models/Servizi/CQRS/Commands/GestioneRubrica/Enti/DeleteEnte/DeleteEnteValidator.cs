using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteValidator : ICommandValidator<DeleteEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(DeleteEnteCommand command)
        {
            if (command.Id != null && command.idOperatore != null)
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
        }
    }
}
