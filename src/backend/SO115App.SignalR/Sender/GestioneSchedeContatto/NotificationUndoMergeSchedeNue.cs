﻿//-----------------------------------------------------------------------
// <copyright file="NotificationUndoMergeSchedeNue.cs" company="CNVVF">
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
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.UndoMergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationUndoMergeSchedeNue : INotificationUndoMergeSchedeNue
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationUndoMergeSchedeNue(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(UndoMergeSchedeNueCommand command)
        {
            var listaSchedeNueNonMergiate = new List<SchedaContatto>();
            foreach (var schedafiglia in command.SchedaNue.Collegate)
            {
                schedafiglia.Collegata = false;
                listaSchedeNueNonMergiate.Add(schedafiglia);
            }
            command.SchedaNue.Collegate = null;

            await _notificationHubContext.Clients.All.SendAsync("NotifyInsertSchedeContatto", listaSchedeNueNonMergiate);
            await _notificationHubContext.Clients.All.SendAsync("NotifyUpdateSchedaContatto", command.SchedaNue);
        }
    }
}
