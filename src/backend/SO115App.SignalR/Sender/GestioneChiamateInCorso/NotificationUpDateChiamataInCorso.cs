//-----------------------------------------------------------------------
// <copyright file="NotificationUpDateChiamataInCorso.cs" company="CNVVF">
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

using DomainModel.CQRS.Commands.ChiamataInCorsoMarker;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamateInCorso
{
    public class NotificationUpDateChiamataInCorso : INotificationUpDateChiamataInCorso
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationUpDateChiamataInCorso(IHubContext<NotificationHub> NotificationHubContext)
        {
            _notificationHubContext = NotificationHubContext;
        }

        public async Task SendNotification(UpDateChiamataInCorsoMarkerCommand chiamata)
        {
            await _notificationHubContext.Clients.Group(chiamata.ChiamataInCorso.codiceSedeOperatore).SendAsync("NotifyChiamataInCorsoMarkerAdd", chiamata);
        }
    }
}
