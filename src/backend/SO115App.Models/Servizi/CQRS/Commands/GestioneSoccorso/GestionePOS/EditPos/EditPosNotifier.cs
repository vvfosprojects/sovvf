﻿//-----------------------------------------------------------------------
// <copyright file="AddPosNotifier.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.EditPos
{
    public class EditPosNotifier : ICommandNotifier<EditPosCommand>
    {
        private readonly INotificationEditPos _sender;

        public EditPosNotifier(INotificationEditPos sender)
        {
            _sender = sender;
        }

        public void Notify(EditPosCommand command)
        {
            _sender.SendNotification(command);
        }
    }
}
