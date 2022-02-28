using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteBlock;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza
{
    public interface INotificationDeleteBlock
    {
        Task SendNotification(DeleteBlockCommand command);
    }
}
