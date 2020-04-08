//-----------------------------------------------------------------------
// <copyright file="UpDateInterventoValidator.cs" company="CNVVF">
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
using CQRS.Commands.Validators;
using SO115App.Models.Classi.Utility;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.UpDateIntervento
{
    public class UpDateInterventoValidator : ICommandValidator<UpDateInterventoCommand>
    {
        public IEnumerable<ValidationResult> Validate(UpDateInterventoCommand command)
        {
            /*
            Controlli sui codici
            Se lo stato è 0 - Chiamata non devono essere presenti codici, verranno messi dal BE
            Se lo stato è 1 - Sospesa
            Se lo stato è 2 - Presidiato
            Se lo stato è 3 - Assegnata
            Se lo stato è 4 - Chiusa
            */

            // Controlli sul richiedente
            if (command.Chiamata.Richiedente.Nominativo.Length > 0)
            {
                if (string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Nominativo))
                {
                    yield return new ValidationResult(Costanti.NominativoNonPresente);
                }
            }
        }
    }
}
