using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationAddUtente : INotifyAddUtente
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetUtenteByCF _getUtenteByCF;

        public NotificationAddUtente(IHubContext<NotificationHub> notificationHubContext, IGetUtenteByCF getUtenteByCF)
        {
            _notificationHubContext = notificationHubContext;
            _getUtenteByCF = getUtenteByCF;
        }

        public async Task Notify(AddUtenteCommand command)
        {
            var utente = _getUtenteByCF.Get(command.CodFiscale);
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true);
            await _notificationHubContext.Clients.Group(utente.Sede.Codice).SendAsync("NotifyRefreshUtenti", true);
        }
    }
}
