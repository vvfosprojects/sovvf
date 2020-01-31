//-----------------------------------------------------------------------
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
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.UndoMergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationUndoMergeSchedeNue : INotificationUndoMergeSchedeNue
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> _getSchedeContattoHandler;

        public NotificationUndoMergeSchedeNue(IHubContext<NotificationHub> notificationHubContext, IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> getSchedeContattoHandler)
        {
            _notificationHubContext = notificationHubContext;
            _getSchedeContattoHandler = getSchedeContattoHandler;
        }

        public async Task SendNotification(UndoMergeSchedeNueCommand command)
        {
            var getSchedeContatto = new GetSchedeContattoQuery
            {
                CodiceSede = command.CodiceSede
            };

            var schedaContattoUpdated = _getSchedeContattoHandler.Handle(getSchedeContatto).SchedeContatto;
            await _notificationHubContext.Clients.Groups(command.CodiceSede).SendAsync("NotifyGetUpdateSchedaContatto", schedaContattoUpdated);
        }
    }
}
