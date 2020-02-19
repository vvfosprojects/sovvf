using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneRuoli
{
    public class NotificationAddRuoli : INotifyAddRuoli
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAddRuoli(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task Notify(AddRuoliUtenteCommand command)
        {
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true);
        }
    }
}
