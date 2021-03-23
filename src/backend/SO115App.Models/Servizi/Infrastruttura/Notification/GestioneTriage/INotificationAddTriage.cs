using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage
{
    public interface INotificationAddTriage
    {
        Task SendNotification(AddTriageCommand command);
    }
}
