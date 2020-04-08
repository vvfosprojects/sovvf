//-----------------------------------------------------------------------
// <copyright file="AuthorizingCommandHandlerDecorator.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System.Collections.Generic;
using System.Linq;
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
