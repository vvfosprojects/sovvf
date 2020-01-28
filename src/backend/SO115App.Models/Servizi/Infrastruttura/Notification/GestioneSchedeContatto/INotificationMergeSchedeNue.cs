using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationMergeSchedeNue
    {
        Task SendNotification(MergeSchedeNueCommand command);
    }
}
