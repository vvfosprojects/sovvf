using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.EditPos;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePos
{
    public class NotificationEditPos : INotificationEditPos
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;

        public NotificationEditPos(IHubContext<NotificationHub> notificationHubContext,
                                               GetGerarchiaToSend getGerarchiaToSend,
                                               IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
        }

        public async Task SendNotification(EditPosCommand command)
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
                hubConnection.InvokeAsync("NotifyPos", $"E' stata modificata la pos {command.Pos.DescrizionePos} ", sede);
                hubConnection.StopAsync();
            }));
        }
    }
}
