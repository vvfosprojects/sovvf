using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaLetta;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationSetSchedaLetta
    {
        Task SendNotification(SetSchedaLettaCommand command);
    }
}
