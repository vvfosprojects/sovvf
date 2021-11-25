using DomainModel.CQRS.Commands.HLogBook;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento
{
    public interface INotificationLogBook
    {
        Task SendNotification(LogBookCommand command);
    }
}
