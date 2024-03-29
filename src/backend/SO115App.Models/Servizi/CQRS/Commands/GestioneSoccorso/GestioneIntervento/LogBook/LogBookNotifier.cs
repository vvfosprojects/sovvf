﻿//-----------------------------------------------------------------------
// <copyright file="LogBookNotifier.cs" company="CNVVF">
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
using CQRS.Commands.Notifiers;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;

namespace DomainModel.CQRS.Commands.HLogBook
{
    public class LogBookNotifier : ICommandNotifier<LogBookCommand>
    {
        private readonly INotificationLogBook _sender;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;

        public LogBookNotifier(INotificationLogBook sender,
                               IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice)
        {
            _sender = sender;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
        }

        public void Notify(LogBookCommand command)
        {
            //command.Richiesta = _getSintesiRichiestaByCodice.GetSintesi(command.CodiceRichiesta);
            _sender.SendNotification(command);
        }
    }
}
