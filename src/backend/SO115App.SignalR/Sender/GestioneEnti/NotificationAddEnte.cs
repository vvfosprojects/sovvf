using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationAddEnte : INotificationAddEnte
    {
        IHubContext<NotificationHub> _notificationHubContext;
        public NotificationAddEnte(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(AddEnteCommand command)
        {
            return;
        }
    }
}
