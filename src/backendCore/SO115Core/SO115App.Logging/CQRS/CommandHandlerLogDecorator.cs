using System;
using System.Diagnostics;
using CQRS.Commands;
using Newtonsoft.Json;
using Serilog;

namespace SO115App.Logging.CQRS
{
    public class CommandHandlerLogDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decorated;

        public CommandHandlerLogDecorator(ICommandHandler<TCommand> decorated)
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
        }

        public void Handle(TCommand command)
        {
            var jsonCommand = JsonConvert.SerializeObject(command);
            var commandClass = command.GetType().ToString();

            Log.Information("Action starting {commandClass}: {jsonCommand}", commandClass, jsonCommand);

            var stopwatch = new Stopwatch();
            stopwatch.Start();
            this.decorated.Handle(command);
            stopwatch.Stop();

            var elapsed = stopwatch.ElapsedMilliseconds;

            Log.Information("Action executed ({elapsed} ms)", elapsed);
        }
    }
}
