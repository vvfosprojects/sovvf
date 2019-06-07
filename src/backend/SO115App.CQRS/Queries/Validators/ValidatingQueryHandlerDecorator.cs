//-----------------------------------------------------------------------
// <copyright file="ValidatingQueryHandlerDecorator.cs" company="CNVVF">
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
using CQRS.Validation;
using Serilog;

namespace CQRS.Queries.Validators
{
    public class ValidatingQueryHandlerDecorator<TQuery, TResult> : IQueryHandler<TQuery, TResult> where TQuery : IQuery<TResult>
    {
        private readonly IQueryHandler<TQuery, TResult> decoratee;
        private readonly IEnumerable<IQueryValidator<TQuery, TResult>> validators;

        public ValidatingQueryHandlerDecorator(
            IEnumerable<IQueryValidator<TQuery, TResult>> validators,
            IQueryHandler<TQuery, TResult> decoratee)
        {
            this.validators = validators;
            this.decoratee = decoratee;
        }

        public TResult Handle(TQuery command)
        {
            Log.Debug("Now validating");

            var validationResults = (
                from validator in this.validators
                from result in validator.Validate(command)
                select result)
                .ToArray();

            if (validationResults.Any())
            {
                throw new ValidationException(validationResults);
            }

            return this.decoratee.Handle(command);
        }
    }
}
