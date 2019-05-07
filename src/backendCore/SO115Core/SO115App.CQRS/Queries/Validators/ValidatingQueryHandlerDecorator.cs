using CQRS.Validation;
using Serilog;
using System.Collections.Generic;
using System.Linq;

namespace CQRS.Queries.Validators
{
    public class ValidatingQueryHandlerDecorator<TQuery, TResult> : IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        private readonly IQueryHandler<TQuery, TResult> decoratee;
        private readonly IEnumerable<IQueryValidator<TQuery, TResult>> validators;

        public ValidatingQueryHandlerDecorator(
            IEnumerable<IQueryValidator<TQuery, TResult>> validators,
            IQueryHandler<TQuery, TResult> decoratee)
        {
            this.validators = validators;
            this.decoratee = decoratee;
        }

        public TResult Handle(TQuery command)
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

            return this.decoratee.Handle(command);
        }
    }
}