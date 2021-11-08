using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto
{
    public interface INotificationContatoreSchedeNue
    {
        Task SendNotification(string CodSede);
    }
}
