
using System.Collections.Generic;
using System.Linq;
using SO115App.API.Models.Servizi.CQRS.Commands;

namespace SO115App.API.Models.AOP.Validation
{
    public class ValidatingCommandHandlerDecorator<T> : ICommandHandler<T>
    {
        private readonly ICommandHandler<T> decoratee;
        private readonly IEnumerable<ICommandValidator<T>> validators;

        public ValidatingCommandHandlerDecorator(
            IEnumerable<ICommandValidator<T>> validators,
            ICommandHandler<T> decoratee)
        {
            this.validators = validators;
            this.decoratee = decoratee;
        }

        public void Handle(T command)
        {
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