using CQRS.Authorization;
using System.Collections.Generic;

namespace CQRS.Queries.Authorizers
{
    public interface IQueryAuthorizer<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        IEnumerable<AuthorizationResult> Authorize(TQuery query);
    }
}