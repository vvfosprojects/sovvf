using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteBlock;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneConcorrenza
{
    public class NotificationDeleteBlock : INotificationDeleteBlock
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationDeleteBlock(IHubContext<NotificationHub> NotificationHubContext,
                                       GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(DeleteBlockCommand command)
        {
            var SediDaNotificare = new List<string>();
            if (command.listaSediDaAllertare!=null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede, command.listaSediDaAllertare.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede);

            foreach (var sede in SediDaNotificare)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyConcorrenza", command);
            }
        }
    }
}
