using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePos
{
    public class NotificationAddPos : INotificationAddPos
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;

        public NotificationAddPos(IHubContext<NotificationHub> notificationHubContext,
                                               GetGerarchiaToSend getGerarchiaToSend, IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
        }

        public async Task SendNotification(AddPosCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = _getGerarchiaToSend.Get(command.Pos.CodSede);

            await Task.Factory.StartNew(() => Parallel.ForEach(SediDaNotificare, sede =>
            {
                hubConnection.StartAsync();
                hubConnection.InvokeAsync("NotifyPos", $"E' stata inserita la pos {command.Pos.DescrizionePos} ", sede);
                hubConnection.StopAsync();
            }));
        }
    }
}
