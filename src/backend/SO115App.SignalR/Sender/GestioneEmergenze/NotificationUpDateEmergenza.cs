using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationUpDateEmergenza : INotifyUpDateEmergenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationUpDateEmergenza(IHubContext<NotificationHub> notificationHubContext,
                                           GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        void INotifyUpDateEmergenza.Send(Emergenza emergenza)
        {
            var ListaSediDestinatarie = _getGerarchiaToSend.Get(emergenza.CodComandoRichiedente);

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyModificaEmergenza", emergenza);

            Parallel.ForEach(ListaSediDestinatarie, sede =>
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyModificaEmergenza", emergenza)
            );
        }
    }
}
