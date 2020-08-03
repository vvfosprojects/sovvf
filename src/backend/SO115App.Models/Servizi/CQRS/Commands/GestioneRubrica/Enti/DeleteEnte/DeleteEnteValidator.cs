using CQRS.Commands.Validators;
using CQRS.Validation;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteValidator : ICommandValidator<DeleteEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(DeleteEnteCommand command)
        {
            return new List<ValidationResult>();
        }
    }
}
