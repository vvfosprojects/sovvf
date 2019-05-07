using System;
using System.Collections.Generic;
using System.Text;
using Serilog;

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