﻿//-----------------------------------------------------------------------
// <copyright file="NotificationDeleteChiamataInCorso .cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamateInCorso
{
    public class NotificationDeleteChiamataInCorso : INotificationDeleteChiamataInCorso
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;

        public NotificationDeleteChiamataInCorso(IHubContext<NotificationHub> NotificationHubContext,
            GetGerarchiaToSend getGerarchiaToSend,
            IGetCompetenzeByCoordinateIntervento getCompetenze)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getCompetenze = getCompetenze;
        }

        public async Task SendNotification(CancellazioneChiamataInCorsoMarkerCommand chiamata)
        {
            //var Competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(chiamata.ChiamataInCorso.Localita.Coordinate);

            var SediDaNotificare = _getGerarchiaToSend.Get(chiamata.ChiamataInCorso.CodiceSedeOperatore);
            //SediDaNotificare.Add(chiamata.ChiamataInCorso.CodiceSedeOperatore);

            foreach (var sede in SediDaNotificare)
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyChiamataInCorsoMarkerDelete", chiamata.ChiamataInCorso.Id);
        }
    }
}
