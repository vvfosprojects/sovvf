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
using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.Models.Classi.Utility;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoValidator : ICommandValidator<AggiornaStatoMezzoCommand>
    {
        public IEnumerable<ValidationResult> Validate(AggiornaStatoMezzoCommand command)
        {
            // Controlli sul richiedente
            if (command.CodRichiesta.Trim().Length == 0)
            {
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            }
        }
    }
}
