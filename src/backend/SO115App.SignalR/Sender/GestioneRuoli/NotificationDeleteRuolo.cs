using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneRuoli
{
    public class NotificationDeleteRuolo : INotifyDeleteRuolo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetUtenteByCF _getUtenteByCF;

        public NotificationDeleteRuolo(IHubContext<NotificationHub> notificationHubContext, IGetUtenteByCF getUtenteByCF)
        {
            _notificationHubContext = notificationHubContext;
            _getUtenteByCF = getUtenteByCF;
        }

        public async Task Notify(DeleteRuoliUtenteCommand command)
        {
            var utente = _getUtenteByCF.Get(command.CodFiscale);
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true).ConfigureAwait(false);
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyModificatoRuoloUtente", utente).ConfigureAwait(false);
            await _notificationHubContext.Clients.Group(utente.Sede.Codice).SendAsync("NotifyRefreshUtenti", true).ConfigureAwait(false);
            await _notificationHubContext.Clients.Group(utente.Sede.Codice).SendAsync("NotifyModificatoRuoloUtente", utente).ConfigureAwait(false);
        }
    }
}
