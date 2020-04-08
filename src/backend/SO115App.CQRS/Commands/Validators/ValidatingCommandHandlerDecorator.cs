//-----------------------------------------------------------------------
// <copyright file="ValidatingCommandHandlerDecorator.cs" company="CNVVF">
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

// Credits to Steven van Deursen for this implementation https://stackoverflow.com/questions/52593426/registering-open-generic-decorators-through-a-single-binding-rule

namespace CQRS.Commands.Validators
{
    public class ValidatingCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decoratee;
        private readonly IEnumerable<ICommandValidator<TCommand>> validators;

        public ValidatingCommandHandlerDecorator(
            IEnumerable<ICommandValidator<TCommand>> validators,
            ICommandHandler<TCommand> decoratee)
        {
            this.validators = validators;
            this.decoratee = decoratee;
        }

        public void Handle(TCommand command)
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

            this.decoratee.Handle(command);
        }
    }
}
