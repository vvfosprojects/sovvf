using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneTriage
{
    public class NotificationUpDateTriage : INotificationUpDateTriage
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationUpDateTriage(
            IHubContext<NotificationHub> notificationHubContext,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative
            )
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
        }

        public async Task SendNotification(UpDateTriageCommand command)
        {
            var SediDaNotificareAdd = _getGerarchiaToSend.Get(command.Triage.CodiceSede);

            foreach (var sede in SediDaNotificareAdd)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpDateTriage", command);
            }
        }
    }
}
