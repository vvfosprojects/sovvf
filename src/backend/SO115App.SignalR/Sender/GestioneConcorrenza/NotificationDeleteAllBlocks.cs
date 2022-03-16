using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteAllBlocks;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneConcorrenza
{
    public class NotificationDeleteAllBlocks : INotificationDeleteAllBlocks
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;

        public NotificationDeleteAllBlocks(IHubContext<NotificationHub> NotificationHubContext,
                                           GetGerarchiaToSend getGerarchiaToSend,
                                           IGetAllBlocks getAllBlocks,
                                           IGetSintesiRichiestaAssistenzaByCodice getSintesiById)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getAllBlocks = getAllBlocks;
            _getSintesiById = getSintesiById;
        }

        public async Task SendNotification(DeleteAllBlocksCommand command)
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
