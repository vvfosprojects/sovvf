using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaLetta;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationSetSchedaLetta : INotificationSetSchedaLetta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> _getConteggioSchedeHandler;
        private readonly IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> _getSchedeContattoHandler;

        public NotificationSetSchedaLetta(IHubContext<NotificationHub> notificationHubContext, IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> getConteggioSchedeHandler, IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> getSchedeContattoHandler)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
            _getSchedeContattoHandler = getSchedeContattoHandler;
        }

        public async Task SendNotification(SetSchedaLettaCommand command)
        {
            var getConteggioSchedeQuery = new GetConteggioSchedeQuery
            {
                CodiceSede = command.CodiceSede
            };

            var getSchedeContatto = new GetSchedeContattoQuery
            {
                CodiceSede = command.CodiceSede
            };

            var schedaContattoUpdated = _getSchedeContattoHandler.Handle(getSchedeContatto).SchedeContatto.Find(x => x.CodiceScheda.Equals(command.CodiceScheda));
            var infoNue = _getConteggioSchedeHandler.Handle(getConteggioSchedeQuery).InfoNue;
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyGetContatoriSchedeContatto", infoNue);
            await _notificationHubContext.Clients.Groups(command.CodiceSede).SendAsync("NotifyGetUpdateSchedaContatto", schedaContattoUpdated);
        }
    }
}
