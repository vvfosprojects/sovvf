
using System.Diagnostics;
using SO115App.API.Models.Servizi.CQRS.Commands;

namespace SO115App.API.Models.AOP.Logging
{
    internal class LoggingCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decoratee;

        public LoggingCommandHandlerDecorator(ICommandHandler<TCommand> decoratee)
        {
            this.decoratee = decoratee;
        }

        void ICommandHandler<TCommand>.Handle(TCommand command)
        {
            Trace.WriteLine($"Calling action. { command.GetType().ToString() }");

            // forward the (valid) command to the real command handler.
            this.decoratee.Handle(command);

            Trace.WriteLine("Action called.");
        }
    }
}