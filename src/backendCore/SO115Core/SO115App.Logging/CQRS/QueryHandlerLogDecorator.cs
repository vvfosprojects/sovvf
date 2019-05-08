//-----------------------------------------------------------------------
// <copyright file="QueryHandlerLogDecorator.cs" company="CNVVF">
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
using CQRS.Queries;
using Newtonsoft.Json;
using Serilog;
using System;
using System.Diagnostics;

namespace SO115App.Logging.CQRS
{
    public class QueryHandlerLogDecorator<TQuery, TResult> : IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        private readonly IQueryHandler<TQuery, TResult> decorated;

        public QueryHandlerLogDecorator(IQueryHandler<TQuery, TResult> decorated)
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
        }

        public TResult Handle(TQuery query)
        {
            var jsonQuery = JsonConvert.SerializeObject(query);
            var queryClass = query.GetType().ToString();

            Log.Information("Action starting {queryClass}: {jsonQuery}", queryClass, jsonQuery);

            var stopwatch = new Stopwatch();
            stopwatch.Start();
            var result = this.decorated.Handle(query);
            stopwatch.Stop();

            var elapsed = stopwatch.ElapsedMilliseconds;

            Log.Information("Action executed ({elapsed} ms)", elapsed);

            return result;
        }
    }
}