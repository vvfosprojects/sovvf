
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationAddPos
    {
        Task SendNotification(AddPosCommand command);
    }
}
