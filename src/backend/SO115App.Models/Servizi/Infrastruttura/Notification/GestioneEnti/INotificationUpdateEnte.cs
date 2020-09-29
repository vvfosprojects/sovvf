using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti
{
    public interface INotificationUpdateEnte
    {
        Task SendNotification(UpdateEnteCommand command);
    }
}
