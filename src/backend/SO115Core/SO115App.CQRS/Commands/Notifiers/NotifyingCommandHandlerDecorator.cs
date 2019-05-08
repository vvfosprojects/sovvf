//-----------------------------------------------------------------------
// <copyright file="NotifyingCommandHandlerDecorator.cs" company="CNVVF">
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
using Serilog;
using System.Collections.Generic;

namespace CQRS.Commands.Notifiers
{
    public class NotifyingCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decoratee;
        private readonly IEnumerable<ICommandNotifier<TCommand>> notifiers;

        public NotifyingCommandHandlerDecorator(
            IEnumerable<ICommandNotifier<TCommand>> notifiers,
            ICommandHandler<TCommand> decoratee)
        {
            this.notifiers = notifiers;
            this.decoratee = decoratee;
        }

        public void Handle(TCommand command)
        {
            // execute the action, first
            this.decoratee.Handle(command);

            //then, notify
            Log.Debug("Now notifying");

            foreach (var notifier in this.notifiers)
                notifier.Notify(command);
        }
    }
}