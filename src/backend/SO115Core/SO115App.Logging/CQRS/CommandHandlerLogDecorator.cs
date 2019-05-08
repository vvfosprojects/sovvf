//-----------------------------------------------------------------------
// <copyright file="CommandHandlerLogDecorator.cs" company="CNVVF">
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
using CQRS.Commands;
using Newtonsoft.Json;
using Serilog;
using System;
using System.Diagnostics;

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