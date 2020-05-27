using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationDeleteUtente : INotifyDeleteUtente
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetUtenteByCF _getUtenteByCF;

        public NotificationDeleteUtente(IHubContext<NotificationHub> notificationHubContext, IGetUtenteByCF getUtenteByCF)
        {
            _notificationHubContext = notificationHubContext;
            _getUtenteByCF = getUtenteByCF;
        }

        public async Task Notify(DeleteUtenteCommand command)
        {
            var utente = _getUtenteByCF.Get(command.CodFiscale);
            //await _notificationHubContext.Clients.Group(utente.Sede.Codice).SendAsync("NotifyRefreshUtenti", true);
            //await _notificationHubContext.Clients.Group(command.UtenteRimosso.Sede.Codice).SendAsync("NotifyRefreshUtenti", true);
            await _notificationHubContext.Clients.All.SendAsync("NotifyDeleteUtente", command.UtenteRimosso.Id);
        }
    }
}
