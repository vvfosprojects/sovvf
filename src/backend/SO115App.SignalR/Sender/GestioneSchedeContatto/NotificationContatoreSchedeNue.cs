using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationContatoreSchedeNue : INotificationContatoreSchedeNue
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetConteggioSchede _getConteggioSchede;

        public NotificationContatoreSchedeNue(
            IHubContext<NotificationHub> notificationHubContext,
            IGetConteggioSchede getConteggioSchede)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchede = getConteggioSchede;
        }

        public async Task SendNotification(string CodSede)
        {
            var infoNue = _getConteggioSchede.GetConteggio(new string[] { CodSede });

            await _notificationHubContext.Clients.All.SendAsync("NotifyGetContatoriSchedeContatto", infoNue);
        }
    }
}
