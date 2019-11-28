using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaLetta;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationSetSchedaLetta : INotificationSetSchedaLetta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> _getConteggioSchedeHandler;

        public NotificationSetSchedaLetta(IHubContext<NotificationHub> notificationHubContext, IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> getConteggioSchedeHandler)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
        }

        public async Task SendNotification(SetSchedaLettaCommand command)
        {
            var getConteggioSchedeQuery = new GetConteggioSchedeQuery
            {
                CodiceSede = command.CodiceSede
            };
            var infoNue = _getConteggioSchedeHandler.Handle(getConteggioSchedeQuery).InfoNue;
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyGetContatoriSchedeContatto", infoNue);
        }
    }
}
