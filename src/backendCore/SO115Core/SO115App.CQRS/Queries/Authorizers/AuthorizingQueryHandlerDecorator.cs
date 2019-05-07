using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CQRS.Authorization;
using Serilog;

namespace CQRS.Queries.Authorizers
{
    public class AuthorizingQueryHandlerDecorator<TQuery, TResult>: IQueryHandler<TQuery, TResult> where TQuery: IQuery<TResult>
    {
        private readonly IQueryHandler<TQuery, TResult> decoratee;
        private readonly IEnumerable<IQueryAuthorizer<TQuery, TResult>> authorizers;

        public AuthorizingQueryHandlerDecorator(
            IEnumerable<IQueryAuthorizer<TQuery, TResult>> authorizers,
            IQueryHandler<TQuery, TResult> decoratee)
        {
            this.authorizers = authorizers;
            this.decoratee = decoratee;
        }

        public TResult Handle(TQuery query)
        {
            Log.Debug("Now authorizing");

            var authorizationResults = (
                from authorizer in this.authorizers
                from result in authorizer.Authorize(query)
                select result)
                .ToArray();

            if (authorizationResults.Any())
            {
                throw new AuthorizationException(authorizationResults);
            }

            return this.decoratee.Handle(query);
        }
    }
}
