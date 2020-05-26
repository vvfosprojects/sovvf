//-----------------------------------------------------------------------
// <copyright file="NotificationMergeSchedeNue.cs" company="CNVVF">
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
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationMergeSchedeNue : INotificationMergeSchedeNue
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> _getConteggioSchedeHandler;

        public NotificationMergeSchedeNue(
            IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> getConteggioSchedeHandler)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
        }

        public async Task SendNotification(MergeSchedeNueCommand command)
        {
            var getConteggioSchedeQuery = new GetConteggioSchedeQuery
            {
                CodiciSede = new string[] { command.CodiceSede }
            };

            var infoNue = _getConteggioSchedeHandler.Handle(getConteggioSchedeQuery).InfoNue;
            await _notificationHubContext.Clients.All.SendAsync("NotifyGetContatoriSchedeContatto", infoNue);
            await _notificationHubContext.Clients.All.SendAsync("NotifyUpdateSchedaContatto", command.SchedaNue);

            var codiciSchedecollegate = new string[command.SchedaNue.Collegate.Count];
            int i = 0;

            foreach (var schedaCollegata in command.SchedaNue.Collegate)
            {
                codiciSchedecollegate[i] = schedaCollegata.CodiceScheda;
                i++;
            }

            await _notificationHubContext.Clients.All.SendAsync("NotifyRemoveSchedeContatto", codiciSchedecollegate);
        }
    }
}
