
using System.Collections.Generic;
using System.Linq;
using SO115App.API.Models.Servizi.CQRS.Queries;

namespace SO115App.API.Models.AOP.Validation
{
    public class ValidatingQueryHandlerDecorator<TQuery, TResult> : IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        private readonly IQueryHandler<TQuery,TResult> decoratee;
        private readonly IEnumerable<IQueryValidator<TQuery, TResult>> validators;

        public ValidatingQueryHandlerDecorator(
            IEnumerable<IQueryValidator<TQuery, TResult>> validators,
            IQueryHandler<TQuery, TResult> decoratee)
        {
            this.validators = validators;
            this.decoratee = decoratee;
        }

        public void Handle(TQuery query, TResult res)
        {
            var validationResults = (
                from validator in this.validators
                from result in validator.Validate(query,res)
                select result)
                .ToArray();

            if (validationResults.Any())
            {
                throw new ValidationException(validationResults);
            }

            this.decoratee.Handle(query);
        }

        public TResult Handle(TQuery query)
        {
            return decoratee.Handle(query);
        }
    }
}