using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage
{
    public interface INotificationUpDateTriage
    {
        Task SendNotification(UpDateTriageCommand command);
    }
}
