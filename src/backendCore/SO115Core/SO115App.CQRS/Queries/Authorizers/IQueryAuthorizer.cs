using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Authorization;

namespace CQRS.Queries.Authorizers
{
    public interface IQueryAuthorizer<TQuery, TResult> where TQuery: IQuery<TResult>
    {
        IEnumerable<AuthorizationResult> Authorize(TQuery query);
    }
}
