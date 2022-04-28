using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.DeletePos;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationDeletePos
    {
        Task SendNotification(DeletePosCommand command);
    }
}
