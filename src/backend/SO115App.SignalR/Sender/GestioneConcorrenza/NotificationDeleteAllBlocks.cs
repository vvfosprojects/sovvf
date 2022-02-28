using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteAllBlocks;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneConcorrenza
{
    public class NotificationDeleteAllBlocks : INotificationDeleteAllBlocks
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationDeleteAllBlocks(IHubContext<NotificationHub> NotificationHubContext, GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(DeleteAllBlocksCommand command)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede);

            foreach (var sede in SediDaNotificare)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyConcorrenza", command);
            }
        }
    }
}
