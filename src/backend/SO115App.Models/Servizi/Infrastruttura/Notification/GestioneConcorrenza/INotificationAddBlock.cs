using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza
{
    public interface INotificationAddBlock
    {
        Task SendNotification(AddBlockCommand chiamata);
    }
}
