using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CQRS.Authorization;
using Serilog;

namespace CQRS.Commands.Authorizers
{
    public class AuthorizingCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decoratee;
        private readonly IEnumerable<ICommandAuthorizer<TCommand>> authorizers;

        public AuthorizingCommandHandlerDecorator(
            IEnumerable<ICommandAuthorizer<TCommand>> authorizers,
            ICommandHandler<TCommand> decoratee)
        {
            this.authorizers = authorizers;
            this.decoratee = decoratee;
        }

        public void Handle(TCommand command)
        {
            Log.Debug("Now authorizing");

            var authorizationResults = (
                from authorizer in this.authorizers
                from result in authorizer.Authorize(command)
                select result)
                .ToArray();

            if (authorizationResults.Any())
            {
                throw new AuthorizationException(authorizationResults);
            }

            this.decoratee.Handle(command);
        }
    }
}
