using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneConcorrenza
{
    public class NotificationAddBlock : INotificationAddBlock
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetSediConcorrenza _getSediConcorrenza;

        public NotificationAddBlock(IHubContext<NotificationHub> NotificationHubContext,
                                    GetGerarchiaToSend getGerarchiaToSend,
                                    IGetSediConcorrenza getSediConcorrenza)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getSediConcorrenza = getSediConcorrenza;
        }

        public async Task SendNotification(AddBlockCommand command)
        {
            var SediDaAllertare = new List<string>();

            if (command.concorrenza.Count > 0)
            {
                SediDaAllertare = _getSediConcorrenza.Get(command.concorrenza[0].Type, command.concorrenza[0].Value, command.CodComando);
            }

            var SediDaNotificare = _getGerarchiaToSend.Get(command.CodComando, SediDaAllertare.ToArray());

            SediDaNotificare.Add("00");

            foreach (var sede in SediDaNotificare.Distinct())
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyConcorrenza", command.concorrenza);
            }
        }
    }
}
