using System.Collections.Generic;


namespace Modello.AOP.Validation
{
    public interface IQueryValidator<TQuery, TResult>
    {
        IEnumerable<ValidationResult> Validate(TQuery query,TResult res);
    }
}