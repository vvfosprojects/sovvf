using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.DeletePos;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePos
{
    public class NotificationDeletePos : INotificationDeletePos
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationDeletePos(IHubContext<NotificationHub> notificationHubContext,
                                               GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(DeletePosCommand command)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(command.codSede);

            await Task.Factory.StartNew(() => Parallel.ForEach(SediDaNotificare, sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyPos", $"E' stata eliminata la pos {command.Id} ");
            }));
        }
    }
}
