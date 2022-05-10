using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.EditPos;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationEditPos
    {
        Task SendNotification(EditPosCommand command);
    }
}
