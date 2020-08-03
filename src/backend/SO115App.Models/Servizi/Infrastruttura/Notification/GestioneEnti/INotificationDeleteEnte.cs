using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti
{
    public interface INotificationDeleteEnte
    {
        Task SendNotification(DeleteEnteCommand command);
    }
}
