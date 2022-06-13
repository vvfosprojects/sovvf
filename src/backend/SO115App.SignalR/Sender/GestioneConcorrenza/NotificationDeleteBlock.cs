using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteBlock;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.Utility;
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
        private readonly IGetSediConcorrenza _getSediConcorrenza;

        public NotificationDeleteBlock(IHubContext<NotificationHub> NotificationHubContext,
                                       GetGerarchiaToSend getGerarchiaToSend,
                                       IGetSediConcorrenza getSediConcorrenza)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getSediConcorrenza = getSediConcorrenza;
        }

        public async Task SendNotification(DeleteBlockCommand command)
        {
            var SediDaAllertare = new List<string>();

            if (command.ListaConcorrenza.Count > 0)
            {
                foreach (var concorrenza in command.ListaConcorrenza)
                {
                    SediDaAllertare.AddRange(_getSediConcorrenza.Get(concorrenza.Type, concorrenza.Value, concorrenza.CodComando));
                }
            }

            var SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede, SediDaAllertare.ToArray());
            SediDaNotificare.Add("00");

            foreach (var sede in SediDaNotificare.Distinct())
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyConcorrenza", command);
            }
        }
    }
}
