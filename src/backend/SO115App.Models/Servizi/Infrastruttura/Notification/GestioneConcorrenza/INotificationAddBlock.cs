using SO115App.Models.Classi.Concorrenza;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza
{
    public interface INotificationAddBlock
    {
        Task SendNotification(Concorrenza chiamata);
    }
}
