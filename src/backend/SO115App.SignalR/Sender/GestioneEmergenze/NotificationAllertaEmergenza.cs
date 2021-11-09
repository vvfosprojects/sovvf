using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;


namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationAllertaEmergenza : INotifyAllerta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAllertaEmergenza(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public void Send(Emergenza emergenza)
        {
            _notificationHubContext.Clients.Group("00").SendAsync("NotifyAllertaEmergenza", emergenza);
        }
    }
}
