
using System.Collections.Generic;


namespace Modello.AOP.Validation
{
    public interface ICommandValidator<TCommand>
    {
        IEnumerable<ValidationResult> Validate(TCommand command);
    }
}