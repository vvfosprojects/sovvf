using System.Collections.Generic;
using CQRS.Commands.Validators;
using DomainModel.CQRS.Commands.ChiamataInCorsoMarker;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class ChiamataInCorsoMarkerValidator : ICommandValidator<ChiamataInCorsoMarkerCommand>
    {
        public IEnumerable<ValidationResult> Validate(ChiamataInCorsoMarkerCommand command)
        {
            return null;
        }
    }
}
