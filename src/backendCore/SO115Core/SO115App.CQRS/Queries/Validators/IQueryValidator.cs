using CQRS.Validation;
using System.Collections.Generic;

namespace CQRS.Queries.Validators
{
    public interface IQueryValidator<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        IEnumerable<ValidationResult> Validate(TQuery query);
    }
}