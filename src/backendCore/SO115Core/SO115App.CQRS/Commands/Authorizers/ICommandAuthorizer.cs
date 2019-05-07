using CQRS.Authorization;
using System.Collections.Generic;

namespace CQRS.Commands.Authorizers
{
    public interface ICommandAuthorizer<TCommand>
    {
        IEnumerable<AuthorizationResult> Authorize(TCommand command);
    }
}