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
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", true);
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyRefreshUtenti", _getUtenteByCF.Get(command.CodFiscale));
        }
    }
}
