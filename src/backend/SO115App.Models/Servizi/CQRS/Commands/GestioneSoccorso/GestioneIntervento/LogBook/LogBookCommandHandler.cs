﻿//-----------------------------------------------------------------------
// <copyright file="LogBookCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Soccorso.Eventi.ELogBook;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;
using System.Globalization;
using System.Linq;

namespace DomainModel.CQRS.Commands.HLogBook
{
    public class LogBookCommandHandler : ICommandHandler<LogBookCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiesta _getRichiestaById;

        public LogBookCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiesta getRichiestaById)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(LogBookCommand command)
        {
            var cultureInfo = new CultureInfo("it-IT",false);
            new LogBook(command.Richiesta, DateTime.Parse(command.istante, cultureInfo), command.CodUtente, command.Richiesta.CodRichiesta, command.Text);

            _updateRichiestaAssistenza.UpDate(command.Richiesta);
        }
    }
}
