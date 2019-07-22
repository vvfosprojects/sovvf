//-----------------------------------------------------------------------
// <copyright file="AddInterventoValidator.cs" company="CNVVF">
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
using CQRS.Commands.Validators;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoValidator : ICommandValidator<AddInterventoCommand>
    {
        private readonly Costanti _costanti;
        public IEnumerable<ValidationResult> Validate(AddInterventoCommand command)
        {
            // Controlli sul richiedente
            if (command.Chiamata.Richiedente.Nome.Length > 0)
            {
                if (string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Cognome))
                {
                    yield return new ValidationResult(_costanti.PresenteNomeNonCognome);
                }
            }

            if (!string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.RagioneSociale))
            {
                if (!string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Cognome) && !string.IsNullOrWhiteSpace(command.Chiamata.Richiedente.Nome))
                {
                    yield return new ValidationResult(_costanti.SelezionataPersonaFisica);
                }
            }
        }
    }
}
