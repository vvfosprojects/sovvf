
using System.Collections.Generic;


namespace SO115App.API.Models.AOP.Validation
{
    public interface ICommandValidator<TCommand>
    {
        IEnumerable<ValidationResult> Validate(TCommand command);
    }
}