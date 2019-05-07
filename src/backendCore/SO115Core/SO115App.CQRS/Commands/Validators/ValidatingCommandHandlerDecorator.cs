using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using CQRS.Validation;
using Serilog;

// Credits to Steven van Deursen for this implementation
// https://stackoverflow.com/questions/52593426/registering-open-generic-decorators-through-a-single-binding-rule

namespace CQRS.Commands.Validators
{
    public class ValidatingCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decoratee;
        private readonly IEnumerable<ICommandValidator<TCommand>> validators;

        public ValidatingCommandHandlerDecorator(
            IEnumerable<ICommandValidator<TCommand>> validators,
            ICommandHandler<TCommand> decoratee)
        {
            this.validators = validators;
            this.decoratee = decoratee;
        }

        public void Handle(TCommand command)
        {
            Log.Debug("Now validating");

            var validationResults = (
                from validator in this.validators
                from result in validator.Validate(command)
                select result)
                .ToArray();

            if (validationResults.Any())
            {
                throw new ValidationException(validationResults);
            }

            this.decoratee.Handle(command);
        }
    }
}
