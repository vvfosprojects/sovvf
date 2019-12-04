//-----------------------------------------------------------------------
// <copyright file="SetMezzoPrenotatoValidator.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato
{
    public class SetMezzoPrenotatoValidator : ICommandValidator<SetMezzoPrenotatoCommand>
    {
        private readonly IGetMezziById _getMezziById;

        public SetMezzoPrenotatoValidator(IGetMezziById getMezziById)
        {
            _getMezziById = getMezziById;
        }

        public IEnumerable<ValidationResult> Validate(SetMezzoPrenotatoCommand command)
        {
            var listaCodiciSedi = new List<string>
            {
                command.MezzoPrenotato.CodiceMezzo
            };

            if (command.MezzoPrenotato.SbloccaMezzo && _getMezziById.Get(listaCodiciSedi) == null)
                yield return new ValidationResult(Costanti.MezzoNonPresente);
        }
    }
}
