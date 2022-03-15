using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEntiIntervenuti;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneFonogramma
{
    public class NotificationAddEntiIntervenuti : INotifyAddEntiIntervenuti
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;

        public NotificationAddEntiIntervenuti(IHubContext<NotificationHub> notificationHubContext,
                                              GetGerarchiaToSend getGerarchiaToSend,
                                              IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
        }

        public async Task SendNotification(EntiIntervenutiCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = _getGerarchiaToSend.Get(command.CodSede);

            foreach (var sede in SediDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("ModifyAndNotifySuccessEntiIntervenuti", command, sede);
                await hubConnection.StopAsync();
            }
        }
    }
}
