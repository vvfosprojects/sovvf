using System.Collections.Generic;


namespace SO115App.API.Models.AOP.Validation
{
    public interface IQueryValidator<TQuery, TResult>
    {
        IEnumerable<ValidationResult> Validate(TQuery query,TResult res);
    }
}