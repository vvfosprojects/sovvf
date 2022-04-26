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
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
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
        private readonly IConfiguration _config;

        public NotificationUndoMergeSchedeNue(IHubContext<NotificationHub> notificationHubContext, IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _config = config;
        }

        public async Task SendNotification(UndoMergeSchedeNueCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var listaSchedeNueNonMergiate = new List<SchedaContatto>();
            Parallel.ForEach(command.SchedaNue.Collegate, schedafiglia =>
            {
                schedafiglia.Collegata = false;
                listaSchedeNueNonMergiate.Add(schedafiglia);
            });

            command.SchedaNue.Collegate = null;

            await hubConnection.StartAsync();
            await hubConnection.InvokeAsync("NotifyInsertSchedeContatto", listaSchedeNueNonMergiate);
            await hubConnection.InvokeAsync("NotifyUpdateSchedaContatto", command.SchedaNue);
            await hubConnection.StopAsync();
        }
    }
}
