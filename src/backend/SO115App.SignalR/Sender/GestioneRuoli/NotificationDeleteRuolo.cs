using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneRuoli
{
    public class NotificationDeleteRuolo : INotifyDeleteRuolo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationDeleteRuolo(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task Notify(DeleteRuoliUtenteCommand command)
        {
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true);
        }
    }
}
