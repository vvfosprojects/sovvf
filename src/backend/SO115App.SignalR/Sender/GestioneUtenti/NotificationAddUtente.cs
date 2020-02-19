using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationAddUtente : INotifyAddUtente
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAddUtente(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task Notify(AddUtenteCommand command)
        {
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true);
        }
    }
}
