using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationDeleteEnte : INotificationDeleteEnte
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetRubrica _getRubrica;

        public NotificationDeleteEnte(IGetRubrica getRubrica, IHubContext<NotificationHub> notificationHubContext, GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getRubrica = getRubrica;
        }

        public async Task SendNotification(DeleteEnteCommand command)
        {
            var SediDaNotificare = new List<string>();

            if (command.Ricorsivo)
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede[0]);
            else
                SediDaNotificare.Add(command.CodiceSede[0]);

            var count = _getRubrica.GetTotalItems();

            foreach (var sede in SediDaNotificare)
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteEnte", new { command.Id, Pagination = new Paginazione() { TotalItems = count } });
        }
    }
}
