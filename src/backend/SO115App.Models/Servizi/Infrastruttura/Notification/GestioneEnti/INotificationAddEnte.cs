using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti
{
    public interface INotificationAddEnte
    {
        Task SendNotification(AddEnteCommand command);
    }
}
