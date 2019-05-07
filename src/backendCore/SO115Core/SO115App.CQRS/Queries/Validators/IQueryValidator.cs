using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Validation;

namespace CQRS.Queries.Validators
{
    public interface IQueryValidator<TQuery, TResult> where TQuery: IQuery<TResult>
    {
        IEnumerable<ValidationResult> Validate(TQuery query);
    }
}
