using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationDeleteUtente : INotifyDeleteUtente
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationDeleteUtente(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task Notify(DeleteUtenteCommand command)
        {
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true);
        }
    }
}
