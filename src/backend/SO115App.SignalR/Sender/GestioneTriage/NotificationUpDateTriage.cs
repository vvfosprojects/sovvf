﻿using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneTriage
{
    public class NotificationUpDateTriage : INotificationUpDateTriage
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IConfiguration _config;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationUpDateTriage(
            IHubContext<NotificationHub> notificationHubContext,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IConfiguration config
            )
        {
            _notificationHubContext = notificationHubContext;
            _config = config;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
        }

        public async Task SendNotification(UpDateTriageCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificareAdd = _getGerarchiaToSend.Get(command.Triage.CodiceSede);

            foreach (var sede in SediDaNotificareAdd)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyUpDateTriage", command, sede);
                await hubConnection.StopAsync();
            }
        }
    }
}
