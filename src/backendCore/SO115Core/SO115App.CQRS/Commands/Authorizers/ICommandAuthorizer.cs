using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Authorization;

namespace CQRS.Commands.Authorizers
{
    public interface ICommandAuthorizer<TCommand>
    {
        IEnumerable<AuthorizationResult> Authorize(TCommand command);
    }
}
