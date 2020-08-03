using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationDeleteEnte : INotificationDeleteEnte
    {
        public async Task SendNotification(DeleteEnteCommand command)
        {
            return;
        }
    }
}
