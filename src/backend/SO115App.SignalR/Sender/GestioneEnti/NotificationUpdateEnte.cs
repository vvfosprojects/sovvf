using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationUpdateEnte : INotificationUpdateEnte
    {
        public async Task SendNotification(UpdateEnteCommand command)
        {
            return;
        }
    }
}
