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
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamateInCorso
{
    public class NotificationDeleteChiamataInCorso : INotificationDeleteChiamataInCorso
    {
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IConfiguration _config;

        public NotificationDeleteChiamataInCorso(GetGerarchiaToSend getGerarchiaToSend,
            IGetCompetenzeByCoordinateIntervento getCompetenze, IConfiguration config)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getCompetenze = getCompetenze;
            _config = config;
        }

        public async Task SendNotification(CancellazioneChiamataInCorsoMarkerCommand chiamata)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var Competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(chiamata.ChiamataInCorso.Localita.Coordinate);

            var SediDaNotificare = _getGerarchiaToSend.Get(chiamata.ChiamataInCorso.Competenze[0]);
            //SediDaNotificare.Add(chiamata.ChiamataInCorso.CodiceSedeOperatore);

            foreach (var sede in SediDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyChiamataInCorsoMarkerDelete", chiamata.ChiamataInCorso.Id, sede);
                await hubConnection.StopAsync();
            }
        }
    }
}
